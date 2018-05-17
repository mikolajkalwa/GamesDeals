const logger = require('../lib/logger');

module.exports = (() => {
    return {
        generator: () => {
            logger.info('Ready!');
        }
    };
});