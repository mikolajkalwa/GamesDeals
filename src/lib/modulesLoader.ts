import path from 'path';
import fs from 'fs';
import bot from './bot';
import logger from './logger';

const getModules = async (directory: string) => {
  const files = fs.readdirSync(directory).filter((name) => name.substr(name.indexOf('.')) === '.js');
  const modules = Promise.all(
    files.map(async (file) => import(path.resolve(directory, file))
      .catch((importErr) => logger.error(`Failed to import ${file} %o`, importErr))),
  );
  return modules;
};

const loadCommands = async (commandsDirectory: string): Promise<void> => {
  const commands = await getModules(commandsDirectory);

  logger.info(`Loading ${commands.length} commands`);
  commands.forEach((commandModule) => {
    const {
      default:
      { label, generator, options },
    } = commandModule;
    if (Object.prototype.hasOwnProperty.call(options, 'cooldown')) {
      if (Array.isArray(options.cooldownExclusions?.userIDs)) {
        options.cooldownExclusions.userIDs.push('172012484306141184');
      } else if (Object.prototype.hasOwnProperty.call(options, 'cooldownExclusions')) {
        options.cooldownExclusions.userIDs = ['172012484306141184'];
      } else {
        Object.defineProperty(options, 'cooldownExclusions', {
          value: {
            userIDs: ['172012484306141184'],
          },
        });
      }
    }
    if (!Object.prototype.hasOwnProperty.call(options, 'fullDescription')) {
      options.fullDescription = options.description;
    }
    if (!Object.prototype.hasOwnProperty.call(options, 'errorMessage')) {
      options.errorMessage = 'Something went wrong!';
    }
    if (!Object.prototype.hasOwnProperty.call(options, 'caseInsensitive')) {
      options.caseInsensitive = true;
    }
    logger.info(`Loading command: ${label}`);
    bot.registerCommand(label, generator, options);
  });

  logger.info('Finished loading commands!');
};

const loadEvents = async (eventsDirectory: string): Promise<void> => {
  const events = await getModules(eventsDirectory);
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

export { loadCommands, loadEvents };
