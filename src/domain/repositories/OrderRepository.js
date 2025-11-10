class OrderRepository {
  async create(order) {
    throw new Error('Method not implemented');
  }

  async updateStatus(orderId, status) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findByUserId(userId, { page, pageSize }) {
    throw new Error('Method not implemented');
  }
}

module.exports = OrderRepository;

