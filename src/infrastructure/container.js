const InMemoryUserRepository = require('./repositories/InMemoryUserRepository');
const RegisterUserUseCase = require('../application/use-cases/auth/RegisterUserUseCase');
const LoginUserUseCase = require('../application/use-cases/auth/LoginUserUseCase');

const userRepository = new InMemoryUserRepository();
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository);

module.exports = {
  userRepository,
  registerUserUseCase,
  loginUserUseCase,
};

