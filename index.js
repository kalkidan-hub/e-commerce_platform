const { createServer } = require('./src/interfaces/http/server');
const { config } = require('./src/shared/config/environment');

const app = createServer();

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
