const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const routes = require('./routes');
const { swaggerSpec } = require('./docs/swagger');

const createServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use('/api', routes);

  app.use((req, res, next) => {
    res.status(404).json({
      success: false,
      message: 'Resource not found',
      object: null,
      errors: ['NotFound'],
    });
  });

  app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({
      success: false,
      message: err.message || 'Internal server error',
      object: null,
      errors: err.errors || [err.name || 'Error'],
    });
  });

  return app;
};

module.exports = { createServer };

