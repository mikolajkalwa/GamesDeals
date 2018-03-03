'use strict';

const config = require('../config');

module.exports = (bot => {
    return {
        generator: (msg, args) => {
            if (msg.author.id !== config.ownerID)
                return msg.channel.createMessage('Brak wystarczjących uprawnień.');
            if (args.length === 0)
                return msg.channel.createMessage('Błędne argumenty lub brak argumentów.');

            const toSay = args.join(' ');
            config.channels.forEach(channel => {
                bot.createMessage(channel, toSay);
            });
            msg.channel.createMessage('Wysłano pomyślnie.');
        }
    };
});