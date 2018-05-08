const mongoose = require('mongoose');

const logger = require('../lib/logger');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/Deals')
    .then(() => logger.info('Connected to mongoDB'))
    .catch(err => {
        logger.error(`Failed to connect to mongoDB ${err}`);
        process.exit(1);
    });

module.exports = { mongoose };