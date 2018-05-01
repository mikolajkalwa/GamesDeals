'use strict';

const fs = require('fs');

const logger = require('./lib/logger');
const bot = require('./lib/bot');
const db = require('./lib/db');
const searchGames = require('./bin/searchGames');

// tworzy folder dla logow
const logDir = './logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// inicjuje ilosc deali w bazie (jesli wczesniej nie bylo zadnego dodanego)
db.get('ilosc')
    .then(value => logger.info(`Odczytano ilosc znalezionych deali: ${value}`))
    .catch(err => {
        if (err.notFound) {
            db.put('ilosc', 0)
                .then(() => logger.info('Zainicjowano ilosc znalezionych deali! (0)'))
                .catch(err => logger.error(`Nie udalo sie dodac do bazy! ${err}`));
        }
        else {
            logger.error(`Problem z odczytem wartosci ile dealow juz znalazl: ${err}`);
        }
    });

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
}, 1 * 60 * 60 * 1000);

bot.on('ready', () => {
    logger.info('Gotów!');
});

bot.connect().then(() => bot.editStatus({ name: 'Use _help' }));