const moment = require('moment');

const { Deal } = require('../models/deal');
const { Webhook } = require('../models/webhook');

const logger = require('../lib/logger');

const config = require('../config');

module.exports = (bot => ({
    generator: (msg) => {
        Webhook.countDocuments({})
            .then((createdWebhooks) => {
                Deal.countDocuments({})
                    .then((foundDeals) => {
                        bot.createMessage(msg.channel.id, {
                            content: ':information_source: Statistics:',
                            embed: {
                                color: 0x48f442,
                                fields: [{
                                    inline: true,
                                    name: 'Uptime',
                                    value: moment.duration(bot.uptime).locale('en').humanize(),
                                }, {
                                    inline: true,
                                    name: 'Servers',
                                    value: bot.guilds.size,
                                }, {
                                    inline: true,
                                    name: 'Users',
                                    value: bot.users.size,
                                }, {
                                    inline: false,
                                    name: 'Found Games',
                                    value: JSON.stringify(foundDeals),
                                }, {
                                    inline: true,
                                    name: 'Created Webhooks',
                                    value: JSON.stringify(createdWebhooks),
                                }],
                                timestamp: new Date(),
                            },
                        })
                            .catch(e => logger.warning(`Unable to send a message ${e}`));
                    })
                    .catch((dbErr) => {
                        logger.error(`Failed counting deals ${dbErr}`);
                        bot.createMessage(msg.channel.id, ':exclamation: | An error has occured, please try again later.')
                            .catch(e => logger.warning(`Unable to send a message ${e}`));
                    });
            }).catch((dbErr) => {
                logger.error(`Failed counting deals ${dbErr}`);
                bot.createMessage(msg.channel.id, ':exclamation: | An error has occured, please try again later.')
                    .catch(e => logger.warning(`Unable to send a message ${e}`));
            });
    },
    options: {
        cooldown: 30 * 1000,
        cooldownExclusions: {
            userIDs: [config.ownerID],
        },
        cooldownMessage: 'You have to wait before using this command again.',
        description: 'Uptime, Servers, Users',
        fullDescription: 'Use this command to get basic statistics about the bot.',
    },
}));
