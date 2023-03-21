const Eris = require('eris');

const config = require('../config');

const description = `A bot which provides info about free (discounted) games.
Add it to your server, set up a channel with \`_sendHere\` command and never miss any sale again!
As a source, it uses \`/r/GameDeals\`.
It tries to search for games which price were reduced by 100% (sometimes it also notifies about free weekend games on steam).
**This bot is still under active development and sometimes may break due to my coding skills.**`.trim();

const bot = new Eris.CommandClient(config.token, {}, {
    description,
    owner: 'Mikey#6819',
    prefix: config.prefix,
});

module.exports = bot;
