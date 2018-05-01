'use strict';

const levelup = require('levelup');
const leveldown = require('leveldown');

const config = require('../config');

const db = levelup(leveldown(config.absolutePathtoDB)); // fix it in the future

module.exports = db;