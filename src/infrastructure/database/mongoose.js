const mongoose = require('mongoose');

const { config } = require('../../shared/config/environment');

const connectMongo = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(config.database.mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });

  return mongoose.connection;
};

const disconnectMongo = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

const runInTransaction = async (callback) => {
  const session = await mongoose.startSession();
  let result;
  try {
    session.startTransaction();
    result = await callback(session);
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  return result;
};

module.exports = {
  connectMongo,
  disconnectMongo,
  runInTransaction,
};

