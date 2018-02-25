'use strict';

const Eris = require('eris');

const config = require('../config.js');

const bot = new Eris.CommandClient(config.token, {}, {
    description: 'Super bot co ma brać z reddita info o darmowych gierkach na gogu, humble\'u i steamie, ale nie wiem do końca czy na 100% działa',
    owner: 'Mikey#6819',
    prefix: '_'
});

module.exports = bot;