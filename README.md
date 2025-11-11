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

4. **Start local MongoDB (replica set)**

   Ensure MongoDB is running locally with a replica set. For example:

   ```bash
   mongod --replSet rs0
   # in another terminal, initialise once
   mongosh --eval "rs.initiate()"
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000` (unless `PORT` is overridden).

6. **API documentation**

   Swagger UI is served at `http://localhost:3000/api/docs`.

## Running with Docker Compose

1. **Start MongoDB**

   ```bash
   docker compose up -d mongo
   ```

2. **Check the replica set status**

   ```bash
   docker compose exec mongo mongosh --eval "rs.status().ok"
   ```

   - If the command returns `1`, MongoDB is ready.
   - If you see `no replset config has been received`, initialise it:

     ```bash
     docker compose exec mongo mongosh --eval "rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: 'mongo:27017' }] })"
     ```

3. **Start the API container**

   ```bash
   docker compose up -d api
   ```

4. **Verify the API is running**

   ```bash
   docker compose logs --tail 20 api
   ```

   Look for `Server listening on port 3000`. The application is now reachable at `http://localhost:3000`, and Swagger UI is served at `http://localhost:3000/api/docs/`.


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


