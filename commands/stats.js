'use strict';

const moment = require('moment');
const db = require('../lib/db');
const logger = require('../lib/logger');

const config = require('../config');

module.exports = (bot => {
    return {
        generator: msg => {
            // bierze z bazy ilosc znalezionych gier, i potem sle info o tym + podstawowe statystyki
            db.get('ilosc')
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
                                name: 'Servers',
                                value: bot.guilds.size
                            }, {
                                inline: true,
                                name: 'Users',
                                value: bot.users.size
                            }, {
                                inline: true,
                                name: 'Deals found',
                                value: amount
                            }],
                            timestamp: new Date(),
                        }
                    });
                })
                .catch(err => {
                    logger.error(`Problem z odczytem wartosci ile dealow juz znalazl: ${err}`);
                    bot.createMessage(msg.channel.id, 'An error has occured');
                });
        },
        options: {
            deleteCommand: true,
            description: 'Uptime, Servers, Users',
            fullDescription: 'Use this command to get basic statistics about the bot',
            cooldown: 30 * 1000,
            cooldownMessage: 'You have to wait before using this command again.',
            cooldownExclusions: {
                userIDs: [config.ownerID]
            }
        }
    };
});