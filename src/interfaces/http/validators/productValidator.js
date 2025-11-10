const fs = require('fs/promises');
const AppError = require('../../../shared/errors/AppError');

const removeUploadedFile = (req) => {
  if (req.file) {
    fs.unlink(req.file.path).catch(() => {});
  }
};

const createProductValidator = (req, res, next) => {
  const errors = [];
  const { name, description, price, stock, category } = req.body || {};

  if (!name || typeof name !== 'string' || name.trim().length < 3 || name.trim().length > 100) {
    errors.push('name must be a non-empty string between 3 and 100 characters');
  }

  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    errors.push('description must be at least 10 characters long');
  }

  const numericPrice = Number(price);
  if (price === undefined || price === null || Number.isNaN(numericPrice) || numericPrice <= 0) {
    errors.push('price must be a numeric value greater than 0');
  }

  const numericStock = Number(stock);
  if (
    stock === undefined ||
    stock === null ||
    Number.isNaN(numericStock) ||
    numericStock < 0 ||
    !Number.isInteger(numericStock)
  ) {
    errors.push('stock must be a non-negative integer');
  }

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.push('category is required');
  }

  if (errors.length > 0) {
    removeUploadedFile(req);
    return next(new AppError('Validation failed', 400, errors));
  }

  return next();
};

const updateProductValidator = (req, res, next) => {
  const errors = [];
  const { name, description, price, stock, category } = req.body || {};

  const fieldsProvided = [name, description, price, stock, category].some(
    (value) => value !== undefined
  );

  if (!fieldsProvided && !req.file) {
    removeUploadedFile(req);
    return next(new AppError('At least one field must be provided for update', 400, ['NoFields']));
  }

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length < 3 || name.trim().length > 100) {
      errors.push('name must be a non-empty string between 3 and 100 characters');
    }
  }

  if (description !== undefined) {
    if (typeof description !== 'string' || description.trim().length < 10) {
      errors.push('description must be at least 10 characters long');
    }
  }

  if (price !== undefined) {
    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      errors.push('price must be a numeric value greater than 0');
    }
  }

  if (stock !== undefined) {
    const numericStock = Number(stock);
    if (
      Number.isNaN(numericStock) ||
      numericStock < 0 ||
      !Number.isInteger(numericStock)
    ) {
      errors.push('stock must be a non-negative integer');
    }
  }

  if (category !== undefined) {
    if (typeof category !== 'string' || category.trim().length === 0) {
      errors.push('category is required');
    }
  }

  if (errors.length > 0) {
    removeUploadedFile(req);
    return next(new AppError('Validation failed', 400, errors));
  }

  return next();
};

module.exports = {
  createProductValidator,
  updateProductValidator,
};

