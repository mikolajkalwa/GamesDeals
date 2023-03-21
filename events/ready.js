const logger = require('../lib/logger');

module.exports = (() => ({
    generator: () => {
        logger.info('Ready!');
    },
}));
