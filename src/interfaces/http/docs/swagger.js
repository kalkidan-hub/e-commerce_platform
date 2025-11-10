const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.1',
  info: {
    title: 'E-commerce Platform API',
    version: '1.0.0',
    description: 'API documentation for the e-commerce platform',
  },
  servers: [
    {
      url: '/api',
      description: 'Primary API server',
    },
  ],
  security: [
    {
      bearerAuth: [],
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      BaseResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          object: { type: 'object', nullable: true },
          errors: {
            type: 'array',
            items: { type: 'string' },
            nullable: true,
          },
        },
      },
      PaginatedResponse: {
        allOf: [
          { $ref: '#/components/schemas/BaseResponse' },
          {
            type: 'object',
            properties: {
              object: {
                type: 'array',
                items: { type: 'object' },
              },
              pageNumber: { type: 'integer' },
              pageSize: { type: 'integer' },
              totalSize: { type: 'integer' },
            },
          },
        ],
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: [path.resolve(__dirname, '../routes/**/*.js')],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec };

