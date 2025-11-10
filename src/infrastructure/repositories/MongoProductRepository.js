const ProductRepository = require('../../domain/repositories/ProductRepository');
const Product = require('../../domain/entities/Product');
const ProductModel = require('../database/models/ProductModel');

class MongoProductRepository extends ProductRepository {
  async create(product) {
    await ProductModel.create({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      userId: product.userId,
      imageUrl: product.imageUrl || null,
    });
    return product;
  }

  async update(product) {
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
      }
    );
    return product;
  }

  async findById(id) {
    const doc = await ProductModel.findOne({ id }).lean();
    return doc ? this.toEntity(doc) : null;
  }

  async findAll({ page = 1, pageSize = 10 } = {}) {
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      ProductModel.find().skip(skip).limit(pageSize).lean(),
      ProductModel.countDocuments(),
    ]);

    return {
      items: items.map((doc) => this.toEntity(doc)),
      total,
      page,
      pageSize,
    };
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

