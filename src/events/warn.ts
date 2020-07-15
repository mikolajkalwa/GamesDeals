import logger from '../lib/logger';

export default {
  event: 'warn',
  generator: (message: string, id: number): void => {
    logger.warn(`Shard ${id}: ${message}`);
  },
};
