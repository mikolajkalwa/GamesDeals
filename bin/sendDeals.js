const bot = require('../lib/bot');

const config = require('../config');

const sendDeals = (title, url) => {
    config.channels.forEach(channel => {
        bot.createMessage(channel, `${title} ${url}`);
    });
};

module.exports = sendDeals;