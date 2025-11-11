const PaginatedResponse = require('../../dtos/PaginatedResponse');
const AppError = require('../../../shared/errors/AppError');

class ListProductsUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute({
    page = 1,
    pageSize = 10,
    search,
    category,
    minPrice,
    maxPrice,
    inStock,
  } = {}) {
    const normalizedPage = Number.isNaN(Number(page)) || Number(page) < 1 ? 1 : Number(page);
    const normalizedPageSize =
      Number.isNaN(Number(pageSize)) || Number(pageSize) < 1 ? 10 : Number(pageSize);

    const filters = {};

    if (category && typeof category === 'string' && category.trim() !== '') {
      filters.category = category.trim();
    }

    let normalizedMinPrice;
    if (minPrice !== undefined && minPrice !== null && !Number.isNaN(Number(minPrice))) {
      normalizedMinPrice = Number(minPrice);
      if (normalizedMinPrice < 0) {
        throw new AppError('minPrice must be greater than or equal to 0', 400, ['InvalidMinPrice']);
      }
      filters.minPrice = normalizedMinPrice;
    }

    let normalizedMaxPrice;
    if (maxPrice !== undefined && maxPrice !== null && !Number.isNaN(Number(maxPrice))) {
      normalizedMaxPrice = Number(maxPrice);
      if (normalizedMaxPrice < 0) {
        throw new AppError('maxPrice must be greater than or equal to 0', 400, ['InvalidMaxPrice']);
      }
      filters.maxPrice = normalizedMaxPrice;
    }

    if (
      normalizedMinPrice !== undefined &&
      normalizedMaxPrice !== undefined &&
      normalizedMinPrice > normalizedMaxPrice
    ) {
      throw new AppError('minPrice cannot be greater than maxPrice', 400, ['InvalidPriceRange']);
    }

    if (typeof inStock === 'boolean') {
      filters.inStock = inStock;
    }

    const normalizedSearch =
      search && typeof search === 'string' && search.trim() !== '' ? search.trim() : undefined;

    const [result, total] = await Promise.all([
      this.productRepository.findAll({
        page: normalizedPage,
        pageSize: normalizedPageSize,
        search: normalizedSearch,
        filters,
      }),
      this.productRepository.countAll({ search: normalizedSearch, filters }),
    ]);

    const totalPages = Math.ceil(total / normalizedPageSize) || 1;

    return new PaginatedResponse({
      success: true,
      message: 'Products retrieved successfully',
      object: result.items.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category,
        imageUrl: product.imageUrl,
      })),
      pageNumber: normalizedPage,
      pageSize: normalizedPageSize,
      totalSize: total,
      errors: null,
    });
  }
}

module.exports = ListProductsUseCase;

