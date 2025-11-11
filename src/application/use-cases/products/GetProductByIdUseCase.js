const AppError = require('../../../shared/errors/AppError');

class GetProductByIdUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(id) {
    if (!id || typeof id !== 'string') {
      throw new AppError('Invalid product id', 400, ['InvalidProductId']);
    }

    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404, ['ProductNotFound']);
    }

    return product;
  }
}

module.exports = GetProductByIdUseCase;

