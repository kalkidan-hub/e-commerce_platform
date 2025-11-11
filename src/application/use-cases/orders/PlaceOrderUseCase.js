const { v4: uuidv4 } = require('uuid');

const Order = require('../../../domain/entities/Order');
const AppError = require('../../../shared/errors/AppError');

class PlaceOrderUseCase {
  constructor({ productRepository, orderRepository, runInTransaction }) {
    this.productRepository = productRepository;
    this.orderRepository = orderRepository;
    this.runInTransaction = runInTransaction;
  }

  async execute({ userId, items }) {
    if (!userId) {
      throw new AppError('User not authenticated', 401, ['Unauthorized']);
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new AppError('Order must include at least one product', 400, ['EmptyOrder']);
    }

    items.forEach((item, index) => {
      if (!item || typeof item.productId !== 'string' || item.productId.trim() === '') {
        throw new AppError(`Invalid productId at index ${index}`, 400, ['InvalidProductId']);
      }

      if (
        item.quantity === undefined ||
        item.quantity === null ||
        Number.isNaN(Number(item.quantity)) ||
        Number(item.quantity) <= 0 ||
        !Number.isInteger(Number(item.quantity))
      ) {
        throw new AppError(`Invalid quantity for product ${item.productId}`, 400, [
          'InvalidQuantity',
        ]);
      }
    });

    return this.runInTransaction(async (session) => {
      const orderProducts = [];
      let totalPrice = 0;

      for (const item of items) {
        const quantity = Number(item.quantity);
        const product = await this.productRepository.findById(item.productId, { session });

        if (!product) {
          throw new AppError(`Product not found: ${item.productId}`, 404, ['ProductNotFound']);
        }

        if (product.stock < quantity) {
          throw new AppError(
            `Insufficient stock for product ${product.name}`,
            400,
            ['InsufficientStock']
          );
        }

        product.stock -= quantity;
        await this.productRepository.update(product, { session });

        const linePrice = product.price * quantity;
        totalPrice += linePrice;
        orderProducts.push({
          productId: product.id,
          quantity,
          price: product.price,
        });
      }

      const order = new Order({
        id: uuidv4(),
        userId,
        description: null,
        totalPrice,
        status: 'pending',
        products: orderProducts,
      });

      await this.orderRepository.create(order, { session });

      return {
        id: order.id,
        userId: order.userId,
        totalPrice: order.totalPrice,
        status: order.status,
        products: order.products,
      };
    });
  }
}

module.exports = PlaceOrderUseCase;

