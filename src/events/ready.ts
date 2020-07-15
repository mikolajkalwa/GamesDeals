import logger from '../lib/logger';

export default {
  event: 'ready',
  generator: (): void => {
    logger.info('Ready!');
  },
};
