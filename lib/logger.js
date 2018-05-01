'use strict';

const winston = require('winston');
const moment = require('moment');

const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({
            filename: './logs/gamesDeals.log',
            json: false,
            timestamp: () => {
                return moment().format('YYYY-MM-DD HH:mm:ss');
            },
            formatter: options => {
                return `${options.timestamp()} [${options.level}] ${options.message}`;
            }
        })
    ],
    exceptionHandlers: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({
            filename: './logs/exceptions.log',
            json: false,
            timestamp: () => {
                return moment().format('YYYY-MM-DD HH:mm:ss');
            },
            formatter: options => {
                return `${options.timestamp()} [${options.level}] ${options.message}`;
            }
        })
    ],
    exitOnError: false
});

module.exports = logger;