const fs = require('fs/promises');
const path = require('path');
const BaseResponse = require('../../../application/dtos/BaseResponse');
const cache = require('../../../shared/cache/cache');

class ProductController {
  constructor(
    createProductUseCase,
    updateProductUseCase,
    listProductsUseCase,
    getProductByIdUseCase,
    deleteProductUseCase
  ) {
    this.createProductUseCase = createProductUseCase;
    this.updateProductUseCase = updateProductUseCase;
    this.listProductsUseCase = listProductsUseCase;
    this.getProductByIdUseCase = getProductByIdUseCase;
    this.deleteProductUseCase = deleteProductUseCase;
  }

  async create(req, res, next) {
    try {
      const { name, description, price, stock, category } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

      const product = await this.createProductUseCase.execute({
        name,
        description,
        price,
        stock,
        category,
        userId: req.user.id,
        imageUrl,
      });

      const response = new BaseResponse({
        success: true,
        message: 'Product created successfully',
        object: product,
        errors: null,
      });

      cache.invalidateProductsCache();

      return res.status(201).json(response);
    } catch (error) {
      if (req.file) {
        await fs.unlink(req.file.path).catch(() => {});
      }
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description, price, stock, category } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

      const { product, previousImageUrl } = await this.updateProductUseCase.execute(id, {
        name,
        description,
        price,
        stock,
        category,
        imageUrl,
      });

      if (previousImageUrl) {
        const previousFilename = previousImageUrl.split('/').pop();
        if (previousFilename) {
          const previousPath = path.resolve(__dirname, '../../../../uploads', previousFilename);
          await fs.unlink(previousPath).catch(() => {});
        }
      }

      const response = new BaseResponse({
        success: true,
        message: 'Product updated successfully',
        object: product,
        errors: null,
      });

      cache.invalidateProductsCache();

      return res.status(200).json(response);
    } catch (error) {
      if (req.file) {
        await fs.unlink(req.file.path).catch(() => {});
      }
      return next(error);
    }
  }

  async list(req, res, next) {
    try {
      const { page, limit, pageSize, search, category, minPrice, maxPrice, inStock } = req.query;

      let parsedPage =
        page !== undefined && page !== null && page !== '' ? Number(page) : undefined;
      if (parsedPage !== undefined && (Number.isNaN(parsedPage) || parsedPage < 1)) {
        parsedPage = undefined;
      }

      let parsedPageSize =
        pageSize !== undefined && pageSize !== null && pageSize !== ''
          ? Number(pageSize)
          : limit !== undefined && limit !== null && limit !== ''
          ? Number(limit)
          : undefined;
      if (parsedPageSize !== undefined && (Number.isNaN(parsedPageSize) || parsedPageSize < 1)) {
        parsedPageSize = undefined;
      }

      let parsedInStock;
      if (typeof inStock === 'string') {
        if (['true', '1', 'yes'].includes(inStock.toLowerCase())) {
          parsedInStock = true;
        } else if (['false', '0', 'no'].includes(inStock.toLowerCase())) {
          parsedInStock = false;
        }
      }

      let parsedMinPrice =
        minPrice !== undefined && minPrice !== null && minPrice !== ''
          ? Number(minPrice)
          : undefined;
      if (parsedMinPrice !== undefined && Number.isNaN(parsedMinPrice)) {
        parsedMinPrice = undefined;
      }

      let parsedMaxPrice =
        maxPrice !== undefined && maxPrice !== null && maxPrice !== ''
          ? Number(maxPrice)
          : undefined;
      if (parsedMaxPrice !== undefined && Number.isNaN(parsedMaxPrice)) {
        parsedMaxPrice = undefined;
      }

      const cacheKey = cache.getProductsKey({
        page: parsedPage || 1,
        pageSize: parsedPageSize || 10,
        search: search || '',
        category: category || '',
        minPrice: parsedMinPrice,
        maxPrice: parsedMaxPrice,
        inStock: parsedInStock,
      });

      const cached = cache.get(cacheKey);
      if (cached) {
        return res.status(200).json(cached);
      }

      const response = await this.listProductsUseCase.execute({
        page: parsedPage,
        pageSize: parsedPageSize,
        search,
        category,
        minPrice: parsedMinPrice,
        maxPrice: parsedMaxPrice,
        inStock: parsedInStock,
      });

      const payload = {
        success: response.success,
        message: response.message,
        currentPage: response.pageNumber,
        pageSize: response.pageSize,
        totalPages: Math.ceil(response.totalSize / response.pageSize) || 1,
        totalProducts: response.totalSize,
        products: response.object,
        errors: response.errors,
      };

      cache.set(cacheKey, payload);

      return res.status(200).json(payload);
    } catch (error) {
      return next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await this.getProductByIdUseCase.execute(id);

      return res.status(200).json({
        success: true,
        message: 'Product retrieved successfully',
        object: product,
        errors: null,
      });
    } catch (error) {
      return next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.deleteProductUseCase.execute(id);
      cache.invalidateProductsCache();

      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
        object: null,
        errors: null,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = ProductController;

