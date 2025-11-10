const { v4: uuidv4 } = require('uuid');

const Product = require('../../../domain/entities/Product');
const AppError = require('../../../shared/errors/AppError');

class CreateProductUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute({ name, description, price, stock, category, userId, imageUrl }) {
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    if (!trimmedName || trimmedName.length < 3 || trimmedName.length > 100) {
      throw new AppError('Product name must be between 3 and 100 characters', 400, ['InvalidName']);
    }

    const trimmedDescription = typeof description === 'string' ? description.trim() : '';
    if (!trimmedDescription || trimmedDescription.length < 10) {
      throw new AppError('Product description must be at least 10 characters', 400, ['InvalidDescription']);
    }

    if (price === undefined || price === null || Number.isNaN(Number(price)) || Number(price) <= 0) {
      throw new AppError('Price must be a number greater than 0', 400, ['InvalidPrice']);
    }

    if (
      stock === undefined ||
      stock === null ||
      Number.isNaN(Number(stock)) ||
      Number(stock) < 0 ||
      !Number.isInteger(Number(stock))
    ) {
      throw new AppError('Stock must be a non-negative integer', 400, ['InvalidStock']);
    }

    const trimmedCategory = typeof category === 'string' ? category.trim() : '';
    if (!trimmedCategory) {
      throw new AppError('Category is required', 400, ['InvalidCategory']);
    }

    const product = new Product({
      id: uuidv4(),
      name: trimmedName,
      description: trimmedDescription,
      price: Number(price),
      stock: Number(stock),
      category: trimmedCategory,
      userId,
      imageUrl: imageUrl || null,
    });

    await this.productRepository.create(product);

    return product;
  }
}

module.exports = CreateProductUseCase;

