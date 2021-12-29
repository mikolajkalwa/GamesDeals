import bot from './bot';
import logger from './logger';
import * as events from '../events';

const loadEvents = (): void => {
  const eventsToLoad = Object.values(events);

  logger.info(`Loading ${eventsToLoad.length} events`);

  eventsToLoad.forEach((eventModule) => {
    const { event, generator } = eventModule.default;
    logger.info(`Loading event: ${event}`);

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    bot.on(event, generator);
  });

  logger.info('Finished loading events!');
};

export default loadEvents;
