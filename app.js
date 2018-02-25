'use strict';

const fs = require('fs');

const logger = require('./lib/logger');
const bot = require('./lib/bot');
const utils = require('./lib/utils');

const config = require('./config');

bot.on('ready', () => {
    logger.info('Gotów!');
});

fs.readdir('./commands', (err, files) => {
    if (err) logger.error(err);
    logger.info(`Próba wczytania ${files.length} komend do pamięci`);
    files.forEach(file => {
        try {
            const command = require(`./commands/${file}`)(bot);
            logger.info(`Próba wczytania ${file}`);
            bot.registerCommand(file.slice(0, -3), command.generator);
        }
        catch (err) {
            logger.error(`Podczas wczytywania komendy wystąpił błąd ${err}`);
        }
    });
    logger.info('Wczytywanie komend zakończone!');
});

setInterval(() => {
    utils.searchGames();
}, 5 * 60 * 1000);

logger.on('error', err => {
    bot.getDMChannel(config.ownerID)
        .then((channel) =>
            bot.createMessage(channel.id, `Wystąpił błąd ${err}`));
});

bot.connect();