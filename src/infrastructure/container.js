const MongoUserRepository = require('./repositories/MongoUserRepository');
const MongoProductRepository = require('./repositories/MongoProductRepository');
const RegisterUserUseCase = require('../application/use-cases/auth/RegisterUserUseCase');
const LoginUserUseCase = require('../application/use-cases/auth/LoginUserUseCase');
const CreateProductUseCase = require('../application/use-cases/products/CreateProductUseCase');
const UpdateProductUseCase = require('../application/use-cases/products/UpdateProductUseCase');

const userRepository = new MongoUserRepository();
const productRepository = new MongoProductRepository();
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository);
const createProductUseCase = new CreateProductUseCase(productRepository);
const updateProductUseCase = new UpdateProductUseCase(productRepository);

module.exports = {
  userRepository,
  registerUserUseCase,
  loginUserUseCase,
  productRepository,
  createProductUseCase,
  updateProductUseCase,
};

