const mongoose = require('mongoose');
const config = require('../config');
const logger = require('../lib/logger');

mongoose.Promise = global.Promise;

mongoose.connect(config.mongoDB)
    .then(() => logger.info('Connected to mongoDB'))
    .catch(err => {
        logger.error(`Failed to connect to mongoDB ${err}`);
        process.exit(1);
    });

module.exports = { mongoose };