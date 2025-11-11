const request = require('supertest');

jest.mock('multer', () => {
  const multer = () => ({
    single: () => (req, res, next) => next(),
  });
  multer.diskStorage = () => ({});
  return multer;
});

jest.mock('../src/infrastructure/container', () => {
  const createUseCase = () => ({ execute: jest.fn() });
  return {
    userRepository: {},
    productRepository: {},
    orderRepository: {},
    registerUserUseCase: createUseCase(),
    loginUserUseCase: createUseCase(),
    createProductUseCase: createUseCase(),
    updateProductUseCase: createUseCase(),
    listProductsUseCase: createUseCase(),
    getProductByIdUseCase: createUseCase(),
    deleteProductUseCase: createUseCase(),
    placeOrderUseCase: createUseCase(),
    listUserOrdersUseCase: createUseCase(),
  };
});

jest.mock('../src/interfaces/http/middlewares/authMiddleware', () => {
  const authenticate = jest.fn((req, res, next) => {
    const user = global.__TEST_USER__;
    if (!user) {
      const err = new Error('Unauthorized');
      err.status = 401;
      err.errors = ['Unauthorized'];
      return next(err);
    }
    req.user = user;
    return next();
  });

  const authorizeRolesImpl =
    (...roles) =>
    (req, res, next) => {
      if (!req.user || !roles.includes(req.user.role)) {
        const err = new Error('Forbidden');
        err.status = 403;
        err.errors = ['Forbidden'];
        return next(err);
      }
      return next();
    };

  const authorizeRoles = jest.fn(authorizeRolesImpl);
  const authorizeAdmin = authorizeRolesImpl('Admin');

  return {
    authenticate,
    authorizeRoles,
    authorizeAdmin,
  };
});

const cache = require('../src/shared/cache/cache');
const container = require('../src/infrastructure/container');
const { createServer } = require('../src/interfaces/http/server');

const app = createServer();

describe('HTTP API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cache.invalidateProductsCache();
    global.__TEST_USER__ = { id: 'user-1', role: 'Customer' };
  });

  describe('Auth routes', () => {
    test('POST /api/auth/register returns 201 on success', async () => {
      container.registerUserUseCase.execute.mockResolvedValue({
        id: 'user-1',
        username: 'jane',
        email: 'jane@example.com',
        role: 'Customer',
      });

      const res = await request(app).post('/api/auth/register').send({
        username: 'jane123',
        email: 'jane@example.com',
        password: 'StrongPass!1',
        role: 'Customer',
      });

      expect(res.status).toBe(201);
      expect(container.registerUserUseCase.execute).toHaveBeenCalledWith({
        username: 'jane123',
        email: 'jane@example.com',
        password: 'StrongPass!1',
        role: 'Customer',
      });
      expect(res.body.success).toBe(true);
      expect(res.body.object.email).toBe('jane@example.com');
    });

    test('POST /api/auth/login returns token on success', async () => {
      container.loginUserUseCase.execute.mockResolvedValue({
        token: 'jwt-token',
        user: { id: 'user-1', username: 'jane', email: 'jane@example.com', role: 'Customer' },
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'jane@example.com',
        password: 'StrongPass!1',
      });

      expect(res.status).toBe(200);
      expect(container.loginUserUseCase.execute).toHaveBeenCalledWith({
        email: 'jane@example.com',
        password: 'StrongPass!1',
      });
      expect(res.body.object.token).toBe('jwt-token');
    });
  });

  describe('Product routes', () => {
    test('GET /api/products returns list and caches response', async () => {
      const listResponse = {
        success: true,
        message: 'Products retrieved successfully',
        pageNumber: 1,
        pageSize: 10,
        totalSize: 1,
        object: [{ id: 'prod-1', name: 'Product', price: 10, stock: 5, category: 'Category' }],
        errors: null,
      };
      container.listProductsUseCase.execute.mockResolvedValueOnce(listResponse);

      const first = await request(app).get('/api/products');
      expect(first.status).toBe(200);
      expect(first.body.products).toHaveLength(1);
      expect(container.listProductsUseCase.execute).toHaveBeenCalledTimes(1);

      const second = await request(app).get('/api/products');
      expect(second.status).toBe(200);
      expect(container.listProductsUseCase.execute).toHaveBeenCalledTimes(1);
    });

    test('GET /api/products/:id returns product details', async () => {
      container.getProductByIdUseCase.execute.mockResolvedValue({
        id: 'prod-1',
        name: 'Product',
        price: 10,
        stock: 5,
        category: 'Category',
        description: 'Desc',
      });

      const res = await request(app).get('/api/products/prod-1');

      expect(res.status).toBe(200);
      expect(container.getProductByIdUseCase.execute).toHaveBeenCalledWith('prod-1');
      expect(res.body.object.id).toBe('prod-1');
    });

    test('POST /api/products creates product when admin', async () => {
      global.__TEST_USER__ = { id: 'admin-1', role: 'Admin' };
      container.createProductUseCase.execute.mockResolvedValue({
        id: 'prod-2',
        name: 'New',
        price: 25,
        stock: 10,
        category: 'Category',
      });

      const res = await request(app).post('/api/products').send({
        name: 'New',
        description: 'Long description',
        price: 25,
        stock: 10,
        category: 'Category',
      });

      expect(res.status).toBe(201);
      expect(container.createProductUseCase.execute).toHaveBeenCalled();
      expect(res.body.object.id).toBe('prod-2');
    });

    test('PUT /api/products/:id updates product when admin', async () => {
      global.__TEST_USER__ = { id: 'admin-1', role: 'Admin' };
      container.updateProductUseCase.execute.mockResolvedValue({
        product: {
          id: 'prod-1',
          name: 'Updated',
          price: 30,
          stock: 4,
          category: 'Category',
        },
        previousImageUrl: null,
      });

      const res = await request(app).put('/api/products/prod-1').send({
        name: 'Updated',
        description: 'Updated description',
        price: 30,
        stock: 4,
        category: 'Category',
      });

      expect(res.status).toBe(200);
      expect(container.updateProductUseCase.execute).toHaveBeenCalledWith('prod-1', expect.any(Object));
      expect(res.body.object.name).toBe('Updated');
    });

    test('DELETE /api/products/:id removes product when admin', async () => {
      global.__TEST_USER__ = { id: 'admin-1', role: 'Admin' };
      container.deleteProductUseCase.execute.mockResolvedValue();

      const res = await request(app).delete('/api/products/prod-1');

      expect(res.status).toBe(200);
      expect(container.deleteProductUseCase.execute).toHaveBeenCalledWith('prod-1');
    });
  });

  describe('Order routes', () => {
    test('POST /api/orders places order for customer', async () => {
      global.__TEST_USER__ = { id: 'user-1', role: 'Customer' };
      container.placeOrderUseCase.execute.mockResolvedValue({
        id: 'order-1',
        userId: 'user-1',
        totalPrice: 40,
        status: 'pending',
        products: [{ productId: 'prod-1', quantity: 2, price: 20 }],
      });

      const res = await request(app).post('/api/orders').send({
        items: [{ productId: 'prod-1', quantity: 2 }],
      });

      expect(res.status).toBe(201);
      expect(container.placeOrderUseCase.execute).toHaveBeenCalledWith({
        userId: 'user-1',
        items: [{ productId: 'prod-1', quantity: 2 }],
      });
      expect(res.body.object.status).toBe('pending');
    });

    test('GET /api/orders returns orders for authenticated user', async () => {
      global.__TEST_USER__ = { id: 'user-1', role: 'Customer' };
      container.listUserOrdersUseCase.execute.mockResolvedValue({
        success: true,
        message: 'Orders retrieved successfully',
        pageNumber: 1,
        pageSize: 10,
        totalSize: 1,
        object: [{ id: 'order-1', status: 'pending', totalPrice: 40, createdAt: '2025-01-01' }],
        errors: null,
      });

      const res = await request(app).get('/api/orders');

      expect(res.status).toBe(200);
      expect(container.listUserOrdersUseCase.execute).toHaveBeenCalledWith({
        userId: 'user-1',
        page: undefined,
        pageSize: undefined,
      });
      expect(res.body.orders).toHaveLength(1);
    });

    test('GET /api/orders returns 401 when unauthenticated', async () => {
      global.__TEST_USER__ = null;

      const res = await request(app).get('/api/orders');

      expect(res.status).toBe(401);
    });
  });

  test('GET /api/health responds OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Service healthy');
  });
});

