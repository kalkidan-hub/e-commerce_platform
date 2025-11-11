class ProductRepository {
  async create(product, options = {}) {
    throw new Error('Method not implemented');
  }

  async update(product, options = {}) {
    throw new Error('Method not implemented');
  }

  async findById(id, options = {}) {
    throw new Error('Method not implemented');
  }

  async findAll({ page, pageSize, search, filters }, options = {}) {
    throw new Error('Method not implemented');
  }

  async countAll({ search, filters }, options = {}) {
    throw new Error('Method not implemented');
  }

  async deleteById(id, options = {}) {
    throw new Error('Method not implemented');
  }
}

module.exports = ProductRepository;

