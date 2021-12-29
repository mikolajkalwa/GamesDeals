import logger from '../helpers/logger';

export default {
  event: 'ready',
  generator: (): void => {
    logger.info('Ready!');
  },
};
