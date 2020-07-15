import logger from '../lib/logger';

export default {
  event: 'disconnect',
  generator: (): void => {
    logger.info('All shards disconnected!');
  },
};
