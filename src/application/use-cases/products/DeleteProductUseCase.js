const fs = require('fs/promises');
const path = require('path');

const AppError = require('../../../shared/errors/AppError');

class DeleteProductUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(id) {
    if (!id || typeof id !== 'string') {
      throw new AppError('Invalid product id', 400, ['InvalidProductId']);
    }

    const product = await this.productRepository.deleteById(id);
    if (!product) {
      throw new AppError('Product not found', 404, ['ProductNotFound']);
    }

    if (product.imageUrl) {
      const filename = product.imageUrl.split('/').pop();
      if (filename) {
        const filePath = path.resolve(__dirname, '../../../../uploads', filename);
        await fs.unlink(filePath).catch(() => {});
      }
    }

    return product;
  }
}

module.exports = DeleteProductUseCase;

