const bot = require('../lib/bot');

const logger = require('./lib/logger');

const config = require('../config');

const sendDeals = (title, url) => {
    config.channels.forEach(channel => {
        try {
            bot.createMessage(channel, `${title} ${url}`);
        }
        catch (err) {
            logger.error(`Podczas wysyłania wiadomości nastąpił błąd ${err}`);
        }

    });
};

module.exports = sendDeals;