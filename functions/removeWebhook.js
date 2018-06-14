const { Webhook } = require('../models/webhook');

const logger = require('../lib/logger');

const removeWebhook = (webhookID) => {
    Webhook.findOneAndRemove({ id: webhookID })
        .then((result) => {
            if (!result) {
                logger.warning('Webhook was selected to remove, but can\'t be found in database');
            } else {
                logger.info('Removed an outdated webhook from the database');
            }
        })
        .catch(removeErr => logger.error(`Failed removing outdated webhook. Webhook id: ${webhookID} Error: ${removeErr}`));
};

module.exports = { removeWebhook };

