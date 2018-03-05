'use strict';

const axios = require('axios');

const config = require('../config');

module.exports = (bot => {
    return {
        generator: (msg, args) => {
            if (msg.author.id !== config.ownerID)
                return msg.channel.createMessage('Brak wystarczających uprawnień.');
            if (args.length === 0)
                return msg.channel.createMessage('Błędne argumenty lub brak argumentów.');

            axios.get(args[0], {responseType: 'arraybuffer'}).then(response => {
                bot.editSelf({
                    avatar: `data:${response.headers['content-type']};base64,${Buffer.from(response.data, 'binary').toString('base64')}`
                }).then(() => {
                    msg.channel.createMessage('Zmieniono Avatar!');
                }).catch(() => {
                    msg.channel.createMessage('Podczas zmieniania avatara wystąpił błąd!');
                });
            }).catch(e => {
                msg.channel.createMessage(`Nie udało się pobrać obrazka ${e.message}`);
            });
        }
    };
});