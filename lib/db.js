/* global appRoot:false */
const levelup = require('levelup');
const leveldown = require('leveldown');

const db = levelup(leveldown(`${appRoot}/dealsDB`));

module.exports = db;