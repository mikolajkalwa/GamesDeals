'use strict';

const moment = require('moment');

module.exports = (bot => {
    return {
        generator: msg => {
            bot.createMessage(msg.channel.id, {
                content: 'Informacje:',
                embed: {
                    color: 0x48f442,
                    fields: [{
                        inline: true,
                        name: 'Online',
                        value: moment.duration(bot.uptime).locale('pl').humanize()
                    }, {
                        inline: true,
                        name: 'Serwery',
                        value: bot.guilds.size
                    }, {
                        inline: true,
                        name: 'Użytkownicy',
                        value: bot.users.size
                    }],
                    timestamp: new Date(),
                }
            });
        }
    };
});