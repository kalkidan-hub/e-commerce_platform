const jwt = require('jsonwebtoken');

const AppError = require('../../../shared/errors/AppError');
const { config } = require('../../../shared/config/environment');
const { userRepository } = require('../../../infrastructure/container');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Unauthorized', 401, ['Unauthorized']);
    }

    const token = authHeader.split(' ')[1];
    let payload;

    try {
      payload = jwt.verify(token, config.jwt.secret);
    } catch (err) {
      throw new AppError('Invalid token', 401, ['InvalidToken']);
    }

    const user = await userRepository.findById(payload.userId);
    if (!user) {
      throw new AppError('User not found', 401, ['Unauthorized']);
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return next();
  } catch (error) {
    return next(error);
  }
};

const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'Admin') {
    return next(new AppError('Forbidden', 403, ['Forbidden']));
  }
  return next();
};

module.exports = {
  authenticate,
  authorizeAdmin,
};

