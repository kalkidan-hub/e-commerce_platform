const dotenv = require('dotenv');

dotenv.config();

const getEnv = (key, defaultValue = undefined) => {
  const value = process.env[key];
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }
  return value;
};

const config = {
  nodeEnv: getEnv('NODE_ENV', 'development'),
  port: parseInt(getEnv('PORT', '3000'), 10),
  jwt: {
    secret: getEnv('JWT_SECRET', 'change-me'),
    expiresIn: getEnv('JWT_EXPIRES_IN', '1h'),
  },
};

module.exports = { config };

