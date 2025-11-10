const ProductRepository = require('../../domain/repositories/ProductRepository');

class InMemoryProductRepository extends ProductRepository {
  constructor() {
    super();
    this.products = new Map();
  }

  async create(product) {
    this.products.set(product.id, product);
    return product;
  }

  async update(product) {
    this.products.set(product.id, product);
    return product;
  }

  async findById(id) {
    return this.products.get(id) || null;
  }

  async findAll({ page = 1, pageSize = 10 } = {}) {
    const items = Array.from(this.products.values());
    const offset = (page - 1) * pageSize;
    const paginated = items.slice(offset, offset + pageSize);
    return {
      items: paginated,
      total: items.length,
      page,
      pageSize,
    };
  }
}

module.exports = InMemoryProductRepository;

