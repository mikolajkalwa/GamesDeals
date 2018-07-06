const winston = require('winston');
const moment = require('moment');
const path = require('path');

const projectRoot = path.join(__dirname, '..');


const consoleLogger = new winston.transports.Console({
    colorize: true,
    json: false,
    timestamp: () => moment().format('YYYY-MM-DD HH:mm:ss'),
    formatter: options => `${options.timestamp()} [${options.level}] ${options.message}`,
});

const fileLogger = new winston.transports.File({
    filename: `${projectRoot}/logs/gamesDeals.log`,
    json: false,
    timestamp: () => moment().format('YYYY-MM-DD HH:mm:ss'),
    formatter: options => `${options.timestamp()} [${options.level}] ${options.message}`,
});

const consoleExceptionsLogger = new winston.transports.Console({
    colorize: true,
    json: false,
    timestamp: () => moment().format('YYYY-MM-DD HH:mm:ss'),
    formatter: options => `${options.timestamp()} [${options.level}] ${options.message}`,
});

const fileExceptionsLogger = new winston.transports.File({
    filename: `${projectRoot}/logs/exceptions.log`,
    json: false,
    timestamp: () => moment().format('YYYY-MM-DD HH:mm:ss'),
    formatter: options => `${options.timestamp()} [${options.level}] ${options.message}`,
});


const logger = new (winston.Logger)({
    transports: [consoleLogger, fileLogger],
    exceptionHandlers: [consoleExceptionsLogger, fileExceptionsLogger],
    exitOnError: false,
});


function getStackInfo(stackIndex) { // eslint-disable-line
    const stacklist = new Error().stack.split('\n').slice(3);
    // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
    // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
    const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
    const stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;

    const s = stacklist[stackIndex] || stacklist[0];
    const sp = stackReg.exec(s) || stackReg2.exec(s);

    if (sp && sp.length === 5) {
        return {
            method: sp[1],
            relativePath: path.relative(projectRoot, sp[2]),
            line: sp[3],
            pos: sp[4],
            file: path.basename(sp[2]),
            stack: stacklist.join('\n'),
        };
    }
}

function formatLogArguments(args) {
    const args1 = Array.prototype.slice.call(args);
    const stackInfo = getStackInfo(1);

    if (stackInfo) {
        const calleeStr = `(${stackInfo.relativePath}:${stackInfo.line})`;
        if (typeof args1[0] === 'string') {
            args1[0] = `${args1[0]} ${calleeStr}`;
        } else {
            args1.unshift(calleeStr);
        }
    }
    return args1;
}

function info(...args) {
    logger.info(...formatLogArguments(args));
}
function log(...args) {
    logger.log(...formatLogArguments(args));
}
function warn(...args) {
    logger.warn(...formatLogArguments(args));
}
function debug(...args) {
    logger.debug(...formatLogArguments(args));
}
function verbose(...args) {
    logger.verbose(...formatLogArguments(args));
}

function error(...args) {
    logger.error(...formatLogArguments(args));
}

module.exports = {
    info, log, warn, debug, verbose, error,
};
