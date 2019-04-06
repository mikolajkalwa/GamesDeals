const fs = require('fs');
const path = require('path');
const pino = require('pino-multi-stream');

const logsDir = path.resolve(__dirname, '..', 'log');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const streams = [
  { stream: fs.createWriteStream((path.resolve(logsDir, 'gamesDeals-BOT.log'))) },
  { stream: process.stdout },
];

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
}, pino.multistream(streams));

module.exports = logger;
