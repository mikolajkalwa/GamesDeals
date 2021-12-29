import logger from '../helpers/logger';

export default {
  event: 'disconnect',
  generator: (): void => {
    logger.info('All shards disconnected!');
  },
};
