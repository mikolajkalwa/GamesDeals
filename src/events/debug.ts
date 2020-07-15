import logger from '../lib/logger';

export default {
  event: 'debug',
  generator: (message: string, id: number): void => {
    logger.debug(`Shard ${id}: ${message}`);
  },
};
