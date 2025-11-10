const { createServer } = require('./src/interfaces/http/server');
const { config } = require('./src/shared/config/environment');
const { connectMongo, disconnectMongo } = require('./src/infrastructure/database/mongoose');

const app = createServer();

const start = async () => {
  try {
    await connectMongo();
    app.listen(config.port, () => {
      console.log(`Server listening on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();

const gracefulShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Closing server...`);
  await disconnectMongo();
  process.exit(0);
};

['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, () => gracefulShutdown(signal));
});
