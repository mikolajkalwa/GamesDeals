
const mongoose = require('mongoose');
const logger = require('./logger.js');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
}).catch((err) => {
  logger.error(`Failed to connect to mongoDB ${err}`);
  process.exit(1);
});

mongoose.connection.on('connecting', () => {
  logger.info('Connecting to MongoDB...');
});

mongoose.connection.on('connected', () => {
  logger.info('Connected to MongoDB');
});

mongoose.connection.on('disconnecting', () => {
  logger.info('Disconnecting from MongoDB...');
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Disconnected from MongoDB');
});

mongoose.connection.on('close', () => {
  logger.info('Connection closed successfully');
});

mongoose.connection.on('reconnected', () => {
  logger.info('Mongoose connection restored');
});

mongoose.connection.on('error', (err) => {
  logger.error(`Mongoose default connection error: ${err}`);
});

mongoose.connection.on('reconnectFailed', () => {
  logger.fatal('Could not reconnect to MongoDB!');
  process.exit(1);
});

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    logger.info('Mongoose default connection disconnected through app termination');
    process.exit(0);
  } catch (e) {
    logger.info(`Mongoose default connection couldn't be closed ${e}`);
    process.exit(1);
  }
});

module.exports = mongoose;
