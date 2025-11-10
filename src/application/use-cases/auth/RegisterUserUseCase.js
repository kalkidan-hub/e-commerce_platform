const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const User = require('../../../domain/entities/User');
const AppError = require('../../../shared/errors/AppError');

class RegisterUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ username, email, password }) {
    const existingEmail = await this.userRepository.findByEmail(email);
    if (existingEmail) {
      throw new AppError('Email is already registered', 400, ['EmailTaken']);
    }

    const existingUsername = await this.userRepository.findByUsername(username);
    if (existingUsername) {
      throw new AppError('Username is already taken', 400, ['UsernameTaken']);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
    });

    await this.userRepository.create(user);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }
}

module.exports = RegisterUserUseCase;

