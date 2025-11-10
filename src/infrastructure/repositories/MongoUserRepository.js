const UserRepository = require('../../domain/repositories/UserRepository');
const User = require('../../domain/entities/User');
const UserModel = require('../database/models/UserModel');

class MongoUserRepository extends UserRepository {
  async create(user) {
    await UserModel.create({
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role,
    });
    return user;
  }

  async findById(id) {
    const doc = await UserModel.findOne({ id }).lean();
    return doc ? this.toEntity(doc) : null;
  }

  async findByEmail(email) {
    const doc = await UserModel.findOne({ email }).lean();
    return doc ? this.toEntity(doc) : null;
  }

  async findByUsername(username) {
    const doc = await UserModel.findOne({ username }).lean();
    return doc ? this.toEntity(doc) : null;
  }

  toEntity(doc) {
    return new User({
      id: doc.id,
      username: doc.username,
      email: doc.email,
      password: doc.password,
      role: doc.role,
    });
  }
}

module.exports = MongoUserRepository;

