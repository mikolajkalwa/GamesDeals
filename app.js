const fs = require('fs');

const logger = require('./lib/logger');
const bot = require('./lib/bot');
// moongoose needs to be required, otherwise it won't open a connection... WHY?
const { mongoose } = require('./lib/db'); // eslint-disable-line
const { searchGames } = require('./functions/searchGames');
const { prefix } = require('./config');

const millisecondsInTwoHours = 7200000;


// creates logs directory
const logDir = './logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// loads the commands
fs.readdir('./commands', (err, files) => {
    if (err) return logger.error(err);
    logger.info(`Attempting to load ${files.length} commands into memory`);
    files.forEach((file) => {
        try {
            const command = require(`./commands/${file}`)(bot); // eslint-disable-line
            logger.info(`Attempting to load ${file}`);
            bot.registerCommand(file.slice(0, -3), command.generator, command.options);
        } catch (fileErr) {
            logger.error(`An error has occured trying to load ${file.slice(0, -3)}. Error: ${fileErr}`);
        }
    });
    return logger.info('Commands has been loaded succesfully');
});

// loads the events
fs.readdir('./events', (err, files) => {
    if (err) return logger.error(err);
    logger.info(`Attempting to load ${files.length} events into memory`);
    files.forEach((file) => {
        try {
            const event = require(`./events/${file}`)(bot); // eslint-disable-line
            logger.info(`Attempting to load ${file}`);
            bot.on(file.slice(0, -3), event.generator);
        } catch (fileErr) {
            logger.error(`An error has occured trying to load ${file.slice(0, -3)}. Error: ${fileErr}`);
        }
    });
    return logger.info('Events has been loaded succesfully');
});

// search for games and post stats, once per 2 hours
setInterval(() => {
    searchGames();
}, millisecondsInTwoHours);

bot.connect().then(() => bot.editStatus({ name: `Use ${prefix}help` }));
