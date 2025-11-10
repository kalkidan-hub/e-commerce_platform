const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const User = require('../../../domain/entities/User');
const AppError = require('../../../shared/errors/AppError');

class RegisterUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ username, email, password, role = 'Customer' }) {
    const normalizedUsername = typeof username === 'string' ? username.trim() : '';
    const normalizedEmail = typeof email === 'string' ? email.trim() : '';
    const normalizedRole = role || 'Customer';
    const allowedRoles = ['Customer', 'Admin'];
    if (!allowedRoles.includes(normalizedRole)) {
      throw new AppError('Invalid role', 400, ['InvalidRole']);
    }

    const existingEmail = await this.userRepository.findByEmail(normalizedEmail);
    if (existingEmail) {
      throw new AppError('Email is already registered', 400, ['EmailTaken']);
    }

    const existingUsername = await this.userRepository.findByUsername(normalizedUsername);
    if (existingUsername) {
      throw new AppError('Username is already taken', 400, ['UsernameTaken']);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      id: uuidv4(),
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
      role: normalizedRole,
    });

    await this.userRepository.create(user);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }
}

module.exports = RegisterUserUseCase;

