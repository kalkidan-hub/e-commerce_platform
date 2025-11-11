const PaginatedResponse = require('../../dtos/PaginatedResponse');

class ListUserOrdersUseCase {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute({ userId, page = 1, pageSize = 10 }) {
    if (!userId) {
      throw new Error('UserId is required to list orders');
    }

    const normalizedPage = Number.isNaN(Number(page)) || Number(page) < 1 ? 1 : Number(page);
    const normalizedPageSize =
      Number.isNaN(Number(pageSize)) || Number(pageSize) < 1 ? 10 : Number(pageSize);

    const result = await this.orderRepository.findByUserId(
      userId,
      {
        page: normalizedPage,
        pageSize: normalizedPageSize,
      },
      {}
    );

    const totalPages = Math.ceil(result.total / normalizedPageSize) || 1;

    return new PaginatedResponse({
      success: true,
      message: 'Orders retrieved successfully',
      object: result.items.map((order) => ({
        id: order.id,
        status: order.status,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt,
      })),
      pageNumber: normalizedPage,
      pageSize: normalizedPageSize,
      totalSize: result.total,
      errors: null,
    });
  }
}

module.exports = ListUserOrdersUseCase;

