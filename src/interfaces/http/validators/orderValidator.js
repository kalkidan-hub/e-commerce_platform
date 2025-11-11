const AppError = require('../../../shared/errors/AppError');

const placeOrderValidator = (req, res, next) => {
  const { items } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return next(new AppError('Order must include at least one product', 400, ['EmptyOrder']));
  }

  const errors = [];

  items.forEach((item, index) => {
    if (!item) {
      errors.push(`Order item at index ${index} is invalid`);
      return;
    }

    if (!item.productId || typeof item.productId !== 'string') {
      errors.push(`productId is required for item at index ${index}`);
    }

    if (
      item.quantity === undefined ||
      item.quantity === null ||
      Number.isNaN(Number(item.quantity)) ||
      Number(item.quantity) <= 0 ||
      !Number.isInteger(Number(item.quantity))
    ) {
      errors.push(`quantity must be a positive integer for product ${item.productId || index}`);
    }
  });

  if (errors.length > 0) {
    return next(new AppError('Validation failed', 400, errors));
  }

  return next();
};

module.exports = {
  placeOrderValidator,
};

