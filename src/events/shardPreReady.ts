import logger from '../lib/logger';

export default {
  event: 'shardPreReady',
  generator: (id: number): void => {
    logger.info(`Shard ${id} finished processing the ready packet`);
  },
};
