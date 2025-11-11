const MongoUserRepository = require('./repositories/MongoUserRepository');
const MongoProductRepository = require('./repositories/MongoProductRepository');
const MongoOrderRepository = require('./repositories/MongoOrderRepository');
const { runInTransaction } = require('./database/mongoose');
const RegisterUserUseCase = require('../application/use-cases/auth/RegisterUserUseCase');
const LoginUserUseCase = require('../application/use-cases/auth/LoginUserUseCase');
const CreateProductUseCase = require('../application/use-cases/products/CreateProductUseCase');
const UpdateProductUseCase = require('../application/use-cases/products/UpdateProductUseCase');
const ListProductsUseCase = require('../application/use-cases/products/ListProductsUseCase');
const GetProductByIdUseCase = require('../application/use-cases/products/GetProductByIdUseCase');
const DeleteProductUseCase = require('../application/use-cases/products/DeleteProductUseCase');
const PlaceOrderUseCase = require('../application/use-cases/orders/PlaceOrderUseCase');
const ListUserOrdersUseCase = require('../application/use-cases/orders/ListUserOrdersUseCase');

const userRepository = new MongoUserRepository();
const productRepository = new MongoProductRepository();
const orderRepository = new MongoOrderRepository();
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository);
const createProductUseCase = new CreateProductUseCase(productRepository);
const updateProductUseCase = new UpdateProductUseCase(productRepository);
const listProductsUseCase = new ListProductsUseCase(productRepository);
const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
const deleteProductUseCase = new DeleteProductUseCase(productRepository);
const placeOrderUseCase = new PlaceOrderUseCase({
  productRepository,
  orderRepository,
  runInTransaction,
});
const listUserOrdersUseCase = new ListUserOrdersUseCase(orderRepository);

module.exports = {
  userRepository,
  registerUserUseCase,
  loginUserUseCase,
  productRepository,
  orderRepository,
  createProductUseCase,
  updateProductUseCase,
  listProductsUseCase,
  getProductByIdUseCase,
  deleteProductUseCase,
  placeOrderUseCase,
  listUserOrdersUseCase,
};

