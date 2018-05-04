const mongoose = require('mongoose');

const logger = require('../lib/logger');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/Deals')
    .then(() => logger.info('Polaczono z baza danych'))
    .catch(err => {
        logger.error(`Problem z polaczeniem z baza ${err}`);
        process.exit(1);
    });

module.exports = { mongoose };