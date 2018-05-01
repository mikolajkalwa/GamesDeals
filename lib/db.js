/* global appRoot:false */
'use strict';

const levelup = require('levelup');
const leveldown = require('leveldown');

const db = levelup(leveldown(`${appRoot}/dealsDB`));

module.exports = db;