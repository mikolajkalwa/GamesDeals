const winston = require('winston');
const path = require('path');

const { format, transports } = winston;

const projectRoot = path.join(__dirname, '..');

const myFormat = format.printf(info => `${info.time} [${info.level}] ${info.message}`);

const logger = winston.createLogger({
    level: 'debug',
    levels: winston.config.syslog.levels,
    exitOnError: false,
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
            alias: 'time',
        }),
        myFormat,
    ),
    transports: [
        new transports.Console({ handleExceptions: true }),
        new transports.File({ filename: `${projectRoot}/logs/gamesDeals.log` }),
    ],
    exceptionHandlers: [
        new transports.File({ filename: `${projectRoot}/logs/exceptions.log` }),
    ],
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
function emerg(...args) {
    logger.emerg(...formatLogArguments(args));
}
function alert(...args) {
    logger.alert(...formatLogArguments(args));
}
function crit(...args) {
    logger.crit(...formatLogArguments(args));
}
function error(...args) {
    logger.error(...formatLogArguments(args));
}
function warning(...args) {
    logger.warning(...formatLogArguments(args));
}
function notice(...args) {
    logger.notice(...formatLogArguments(args));
}
function info(...args) {
    logger.info(...formatLogArguments(args));
}
function debug(...args) {
    logger.debug(...formatLogArguments(args));
}

module.exports = {
    emerg, alert, crit, error, warning, notice, info, debug,
};
