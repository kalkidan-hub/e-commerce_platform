const ProductRepository = require('../../domain/repositories/ProductRepository');
const Product = require('../../domain/entities/Product');
const ProductModel = require('../database/models/ProductModel');

class MongoProductRepository extends ProductRepository {
  async create(product, options = {}) {
    await ProductModel.create(
      [
        {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: product.category,
          userId: product.userId,
          imageUrl: product.imageUrl || null,
        },
      ],
      {
        session: options.session || null,
      }
    );
    return product;
  }

  async update(product, options = {}) {
    await ProductModel.updateOne(
      { id: product.id },
      {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        userId: product.userId,
        imageUrl: product.imageUrl || null,
      },
      {
        session: options.session || null,
      }
    );
    return product;
  }

  async findById(id, options = {}) {
    const query = ProductModel.findOne({ id });
    if (options.session) {
      query.session(options.session);
    }
    const doc = await query.lean();
    return doc ? this.toEntity(doc) : null;
  }

  buildQuery({ search, filters = {} }) {
    const query = {};

    if (search && typeof search === 'string' && search.trim() !== '') {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined) {
        query.price.$gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        query.price.$lte = filters.maxPrice;
      }
    }

    if (filters.inStock !== undefined) {
      if (filters.inStock) {
        query.stock = { $gt: 0 };
      } else {
        query.stock = 0;
      }
    }

    return query;
  }

  async findAll({ page = 1, pageSize = 10, search, filters } = {}, options = {}) {
    const skip = (page - 1) * pageSize;
    const query = this.buildQuery({ search, filters });
    const mongooseQuery = ProductModel.find(query)
      .skip(skip)
      .limit(pageSize);

    if (options.session) {
      mongooseQuery.session(options.session);
    }

    const items = await mongooseQuery.lean();

    return {
      items: items.map((doc) => this.toEntity(doc)),
      page,
      pageSize,
    };
  }

  async countAll({ search, filters } = {}, options = {}) {
    const query = this.buildQuery({ search, filters });
    const countQuery = ProductModel.countDocuments(query);
    if (options.session) {
      countQuery.session(options.session);
    }
    return countQuery;
  }

  async deleteById(id, options = {}) {
    const query = ProductModel.findOneAndDelete({ id });
    if (options.session) {
      query.session(options.session);
    }
    const result = await query.lean();
    return result ? this.toEntity(result) : null;
  }

  toEntity(doc) {
    return new Product({
      id: doc.id,
      name: doc.name,
      description: doc.description,
      price: doc.price,
      stock: doc.stock,
      category: doc.category,
      userId: doc.userId,
      imageUrl: doc.imageUrl || null,
    });
  }
}

module.exports = MongoProductRepository;

