const moment = require('moment');

const { Deal } = require('../models/deal');

const logger = require('../lib/logger');

const config = require('../config');

module.exports = (bot => ({
    generator: (msg) => {
        Deal.countDocuments({})
            .then((amount) => {
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
                            name: 'Deals found',
                            value: `${amount}`,
                        }],
                        timestamp: new Date(),
                    },
                })
                    .catch(e => logger.warn(`Unable to send a message ${e}`));
            })
            .catch((dbErr) => {
                logger.error(`Failed counting deals ${dbErr}`);
                bot.createMessage(msg.channel.id, ':exclamation: | An error has occured, please try again later.')
                    .catch(e => logger.warn(`Unable to send a message ${e}`));
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
