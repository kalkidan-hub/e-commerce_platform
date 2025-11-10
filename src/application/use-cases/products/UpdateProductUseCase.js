const AppError = require('../../../shared/errors/AppError');

class UpdateProductUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(productId, { name, description, price, stock, category, imageUrl }) {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new AppError('Product not found', 404, ['ProductNotFound']);
    }

    const previousImageUrl = product.imageUrl || null;

    if (name !== undefined) {
      const trimmedName = typeof name === 'string' ? name.trim() : '';
      if (!trimmedName || trimmedName.length < 3 || trimmedName.length > 100) {
        throw new AppError('Product name must be between 3 and 100 characters', 400, ['InvalidName']);
      }
      product.name = trimmedName;
    }

    if (description !== undefined) {
      const trimmedDescription = typeof description === 'string' ? description.trim() : '';
      if (!trimmedDescription || trimmedDescription.length < 10) {
        throw new AppError('Product description must be at least 10 characters', 400, ['InvalidDescription']);
      }
      product.description = trimmedDescription;
    }

    if (price !== undefined) {
      if (Number.isNaN(Number(price)) || Number(price) <= 0) {
        throw new AppError('Price must be a number greater than 0', 400, ['InvalidPrice']);
      }
      product.price = Number(price);
    }

    if (stock !== undefined) {
      if (
        Number.isNaN(Number(stock)) ||
        Number(stock) < 0 ||
        !Number.isInteger(Number(stock))
      ) {
        throw new AppError('Stock must be a non-negative integer', 400, ['InvalidStock']);
      }
      product.stock = Number(stock);
    }

    if (category !== undefined) {
      const trimmedCategory = typeof category === 'string' ? category.trim() : '';
      if (!trimmedCategory) {
        throw new AppError('Category is required', 400, ['InvalidCategory']);
      }
      product.category = trimmedCategory;
    }

    if (imageUrl !== undefined) {
      product.imageUrl = imageUrl;
    }

    await this.productRepository.update(product);

    return {
      product,
      previousImageUrl: imageUrl !== undefined && previousImageUrl !== product.imageUrl ? previousImageUrl : null,
    };
  }
}

module.exports = UpdateProductUseCase;

