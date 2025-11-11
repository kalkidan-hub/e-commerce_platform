const OrderRepository = require('../../domain/repositories/OrderRepository');
const Order = require('../../domain/entities/Order');
const OrderModel = require('../database/models/OrderModel');

class MongoOrderRepository extends OrderRepository {
  async create(order, options = {}) {
    await OrderModel.create(
      [
        {
          id: order.id,
          userId: order.userId,
          description: order.description || null,
          totalPrice: order.totalPrice,
          status: order.status,
          products: order.products.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      ],
      {
        session: options.session || null,
      }
    );
    return order;
  }

  async updateStatus(orderId, status, options = {}) {
    const result = await OrderModel.findOneAndUpdate(
      { id: orderId },
      { status },
      { new: true, session: options.session || null }
    ).lean();

    return result ? this.toEntity(result) : null;
  }

  async findById(id, options = {}) {
    const query = OrderModel.findOne({ id });
    if (options.session) {
      query.session(options.session);
    }
    const doc = await query.lean();
    return doc ? this.toEntity(doc) : null;
  }

  async findByUserId(userId, { page = 1, pageSize = 10 }, options = {}) {
    const skip = (page - 1) * pageSize;
    const findQuery = OrderModel.find({ userId })
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    if (options.session) {
      findQuery.session(options.session);
    }

    const countQuery = OrderModel.countDocuments({ userId });
    if (options.session) {
      countQuery.session(options.session);
    }

    const [items, total] = await Promise.all([findQuery.lean(), countQuery]);

    return {
      items: items.map((doc) => this.toEntity(doc)),
      total,
      page,
      pageSize,
    };
  }

  toEntity(doc) {
    return new Order({
      id: doc.id,
      userId: doc.userId,
      description: doc.description,
      totalPrice: doc.totalPrice,
      status: doc.status,
      products: doc.products.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}

module.exports = MongoOrderRepository;

