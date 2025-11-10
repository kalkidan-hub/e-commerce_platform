const AppError = require('../../../shared/errors/AppError');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[A-Za-z0-9]+$/;

const passwordValidationRules = [
  { regex: /.{8,}/, message: 'Password must be at least 8 characters long' },
  { regex: /[A-Z]/, message: 'Password must contain at least one uppercase letter' },
  { regex: /[a-z]/, message: 'Password must contain at least one lowercase letter' },
  { regex: /[0-9]/, message: 'Password must contain at least one number' },
  {
    regex: /[^A-Za-z0-9]/,
    message: 'Password must contain at least one special character',
  },
];

const allowedRoles = ['Customer', 'Admin'];

const registerValidator = (req, res, next) => {
  const errors = [];
  const { username, email, password, role } = req.body || {};

  const usernameValue = typeof username === 'string' ? username.trim() : '';
  if (!usernameValue) {
    errors.push('Username is required');
  } else if (!usernameRegex.test(usernameValue)) {
    errors.push('Username must be alphanumeric without spaces or special characters');
  }

  const emailValue = typeof email === 'string' ? email.trim() : '';
  if (!emailValue) {
    errors.push('Email is required');
  } else if (!emailRegex.test(emailValue)) {
    errors.push('Email must be a valid email address');
  }

  if (!password) {
    errors.push('Password is required');
  } else {
    passwordValidationRules.forEach((rule) => {
      if (!rule.regex.test(password)) {
        errors.push(rule.message);
      }
    });
  }

  if (role && !allowedRoles.includes(role)) {
    errors.push('Role must be either Customer or Admin');
  }

  if (errors.length > 0) {
    return next(new AppError('Validation failed', 400, errors));
  }

  return next();
};

const loginValidator = (req, res, next) => {
  const errors = [];
  const { email, password } = req.body || {};

  if (!email) {
    errors.push('Email is required');
  } else if (!emailRegex.test(email)) {
    errors.push('Email must be a valid email address');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return next(new AppError('Validation failed', 400, errors));
  }

  return next();
};

module.exports = {
  registerValidator,
  loginValidator,
};

