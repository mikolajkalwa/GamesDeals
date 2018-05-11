const Eris = require('eris');

const config = require('../config');

const bot = new Eris.CommandClient(config.token, {}, {
    description: 'A cool bot which provides info about free games. Never miss any sale again.',
    owner: 'Mikey#6819',
    prefix: '_'
});

module.exports = bot;