'use strict';

const fs = require('fs');

const logger = require('./lib/logger');
const bot = require('./lib/bot');
const searchGames = require('./functions/searchGames');

// tworzy folder dla logow
const logDir = './logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Wczytuje komendy
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

// funkcja co szuka gier xd
setInterval(() => {
    searchGames();
}, 2 * 60 * 60 * 1000); // raz na dwie godziny

bot.on('ready', () => {
    logger.info('Gotów!');
});

bot.connect().then(() => bot.editStatus({ name: 'Use _help' }));