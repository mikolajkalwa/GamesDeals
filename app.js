'use strict';

const fs = require('fs');

const logger = require('./lib/logger');
const bot = require('./lib/bot');
const utils = require('./lib/utils');

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
            bot.registerCommand(file.slice(0, -3), command.generator, command.options);
        }
        catch (err) {
            logger.error(`Podczas wczytywania komendy ${file.slice(0, -3)} wystąpił błąd ${err}`);
        }
    });
    logger.info('Wczytywanie komend zakończone!');
});

setInterval(() => {
    utils.searchGamesAxios();
}, 1 * 60 * 60 * 1000);

bot.connect();