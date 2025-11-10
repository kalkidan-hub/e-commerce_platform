const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const AppError = require('../../../shared/errors/AppError');
const { config } = require('../../../shared/config/environment');

class LoginUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ email, password }) {
    const normalizedEmail = typeof email === 'string' ? email.trim() : '';

    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw new AppError('Invalid credentials', 401, ['InvalidCredentials']);
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new AppError('Invalid credentials', 401, ['InvalidCredentials']);
    }

    const payload = {
      userId: user.id,
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }
}

module.exports = LoginUserUseCase;

