'use strict';

const config = require('../config');

module.exports = (bot => {
    return {
        generator: (msg, args) => {
            if (msg.author.id !== config.ownerID)
                return msg.channel.createMessage('Brak wystarczających uprawnień.');
            if (args.length === 0)
                return msg.channel.createMessage('Błędne argumenty lub brak argumentów.');

            const newName = args.join(' ');
            bot.editSelf({ username: newName }).then(() => {
                msg.channel.createMessage('Zmieniono nazwę użytkownika!');
            }).catch(() => {
                msg.channel.createMessage('Podczas zmieniania nazwy użytkownika wystąpił błąd!');
            });
        }
    };
});