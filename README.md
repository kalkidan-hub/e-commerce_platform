# E-commerce Platform API

This project implements the backend for a clean-architecture e-commerce platform using Node.js, Express, and MongoDB. It provides REST endpoints for authentication, product management, and orders.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Technology Choices](#technology-choices)

## Prerequisites

- **Node.js** v18+ (recommended v20)
- **npm** v9+ (ships with Node.js)
- **MongoDB** 6+ running as a **replica set** (required for transactions)

For local development, you can run MongoDB with Docker:

```bash
docker run -d --name mongo \
  -p 27017:27017 \
  mongo:7 \
  --replSet rs0

# Initialize the replica set once:
docker exec -it mongo mongosh --eval "rs.initiate()"
```

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/kalkidan-hub/e-commerce_platform.git
   cd e-commerce_platform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` (or `.env.local`) file at the project root and populate the required variables (see [Environment Variables](#environment-variables)).

4. **Run the development server**

   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000` (unless `PORT` is overridden).

5. **API documentation**

   Swagger UI is served at `http://localhost:3000/api/docs`.

## Running with Docker

1. Copy or create a `.env` file with the environment variables you need (optional if you are fine with the defaults in `docker-compose.yml`).
2. Build and start the stack (Mongo replica set + API):

   ```bash
   docker-compose up --build
   ```

3. Once the containers are healthy, the API is available at `http://localhost:3000` and MongoDB is exposed on `mongodb://localhost:27017` (inside the network use `mongo:27017`).

> **Tip:** The compose stack mounts `mongo-init.js` to automatically initialise the single-node replica set (`rs0`). You only need to run `docker-compose up`—no manual `rs.initiate()` call required.

### Docker Troubleshooting

- **Port 27017 already in use:** Stop any local Mongo instance (e.g. `docker rm -f mongo`) or change the mapped port in `docker-compose.yml`.
- **`ReplicaSetNoPrimary` error:** Usually means the replica set hasn’t finished initialising. Run `docker-compose down -v && docker-compose up --build` to recreate the data volume, or execute `docker exec -it <mongo-container> mongosh --eval "rs.initiate()"` once.

## Environment Variables

| Variable                   | Description                                           | Default                                  |
| -------------------------- | ----------------------------------------------------- | ---------------------------------------- |
| `PORT`                     | HTTP server port                                      | `3000`                                   |
| `NODE_ENV`                 | Environment name (`development`, `test`, `production`)| `development`                            |
| `MONGODB_URI`              | MongoDB connection string (replica set required)      | `mongodb://localhost:27017/ecommerce_platform` |
| `JWT_SECRET`               | Secret key for signing JWTs                           | `change-me`                              |
| `JWT_EXPIRES_IN`           | JWT expiration (e.g. `1h`)                            | `1h`                                     |
| `RATE_LIMIT_WINDOW_MS`     | Window size for rate limiting in milliseconds         | `900000` (15 minutes)                    |
| `RATE_LIMIT_MAX_REQUESTS`  | Max requests per window per IP                        | `100`                                    |

**Note:** Additional provider-specific variables (e.g., Cloud storage) will be required when integrating external services.

## Available Scripts

- `npm run dev` – Starts the server with Nodemon reloads.
- `npm start` – Starts the server in production mode.
- `npm test` – Executes Jest test suite.

## Technology Choices

- **Node.js & Express** – Popular, minimalistic framework for building fast HTTP APIs.
- **Mongoose** – Elegant ODM for MongoDB, enabling schema definitions, validation, and transaction support.
- **Clean Architecture** – The project separates concerns into domain, application, infrastructure, and interface layers to keep business rules independent of frameworks and delivery mechanisms.
- **JWT Authentication** – Stateless, extensible authentication approach suitable for APIs.
- **Swagger** – Built-in documentation to aid API exploration and integration.
- **Multer & Local Storage** – Handles product image uploads during early development; easily swappable for cloud storage.
- **Node Cache & Rate Limiting** – Provides essential operational safeguards, caching list responses and throttling repeated requests.
- **Jest & Supertest** – Enables fast unit/integration testing by mocking infrastructure but exercising HTTP endpoints fully.

These choices provide a pragmatic, maintainable foundation that balances rapid iteration with clean separation of concerns.


