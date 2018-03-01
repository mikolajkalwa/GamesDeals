'use strict';

const moment = require('moment');

module.exports = (bot => {
    return {
        generator: msg => {
            bot.createMessage(msg.channel.id, `Bieżący czas bycia online: ${moment.duration(bot.uptime).locale('pl').humanize()}`);
        }
    };
});