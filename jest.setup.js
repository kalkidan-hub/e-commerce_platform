process.env.NODE_ENV = 'test';
process.env.RATE_LIMIT_MAX_REQUESTS = '100000';
process.env.RATE_LIMIT_WINDOW_MS = `${60 * 60 * 1000}`;

