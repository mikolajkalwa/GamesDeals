'use strict';

const levelup = require('levelup');
const leveldown = require('leveldown');

const db = levelup(leveldown('./dealsDB'));

module.exports = db;