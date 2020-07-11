import './env';
import path from 'path';
import fs from 'fs';
import logger from './lib/logger';
import bot from './lib/bot';

const getModules = async (directory: string) => {
  const files = fs.readdirSync(directory).filter((name) => name.substr(name.indexOf('.')) === '.js');
  const modules = Promise.all(
    files.map(async (file) => import(path.resolve(directory, file))
      .catch((importErr) => logger.error(`Failed to import ${file} %o`, importErr))),
  );
  return modules;
};

const loadCommands = async () => {
  const commands = await getModules(path.resolve(__dirname, 'commands'));

  logger.info(`Loading ${commands.length} commands`);
  commands.forEach((commandModule) => {
    const {
      default:
      { label, generator, options },
    } = commandModule;
    logger.info(`Loading command: ${label}`);
    bot.registerCommand(label, generator, options);
  });

  logger.info('Finished loading commands!');
};

const loadEvents = async () => {
  const events = await getModules(path.resolve(__dirname, 'events'));
  logger.info(`Loading ${events.length} events`);
  events.forEach((eventModule) => {
    const {
      default:
      { event, generator },
    } = eventModule;
    logger.info(`Loading event: ${event}`);
    bot.on(event, generator);
  });
  logger.info('Finished loading events!');
};

(async () => {
  await Promise.all([loadEvents(), loadCommands()]);

  bot.connect();
})();
