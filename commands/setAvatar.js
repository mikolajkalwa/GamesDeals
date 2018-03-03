'use strict';

const request = require('request');
const config = require('../config');

module.exports = (bot => {
    return {
        generator: (msg, args) => {
            if (msg.author.id !== config.ownerID)
                return msg.channel.createMessage('Brak wystarczających uprawnień.');
            if (args.length === 0)
                return msg.channel.createMessage('Błędne argumenty lub brak argumentów.');

            request({
                method: 'GET',
                url: args[0],
                encoding: null
            }, (err, res, image) => {
                if (err) msg.channel.createMessage('Nie udało sie pobrać zdjęcia.');
                bot.editSelf({
                    avatar: `data:${res.headers['content-type']};base64,${image.toString('base64')}`
                }).then(() => {
                    msg.channel.createMessage('Zmieniono Avatar!');
                }).catch(() => {
                    msg.channel.createMessage('Podczas zmieniania avatara wystąpił błąd!');
                });
            });
        }
    };
});