const moment = require('moment');

const { mongoose } = require('../lib/db'); // eslint-disable-line
const { Deal } = require('../models/deal');

const logger = require('../lib/logger');

const config = require('../config');

module.exports = (bot => {
    return {
        generator: msg => {
            Deal.count({})
                .then(amount => {
                    bot.createMessage(msg.channel.id, {
                        content: 'Informations:',
                        embed: {
                            color: 0x48f442,
                            fields: [{
                                inline: true,
                                name: 'Uptime',
                                value: moment.duration(bot.uptime).locale('en').humanize()
                            }, {
                                inline: true,
                                name: 'Guilds',
                                value: bot.guilds.size
                            }, {
                                inline: true,
                                name: 'Users',
                                value: bot.users.size
                            }, {
                                inline: false,
                                name: 'Deals found',
                                value: `${amount}`
                            }],
                            timestamp: new Date(),
                        }
                    });
                })
                .catch(err => {
                    logger.error(`Failed counting deals ${err}`);
                    bot.createMessage(msg.channel.id, ':exclamation: | An error has occured, please try again later.');
                });
        },
        options: {
            description: 'Uptime, Servers, Users',
            fullDescription: 'Use this command to get basic statistics about the bot.',
            cooldown: 30 * 1000,
            cooldownMessage: 'You have to wait before using this command again.',
            cooldownExclusions: {
                userIDs: [config.ownerID]
            }
        }
    };
});