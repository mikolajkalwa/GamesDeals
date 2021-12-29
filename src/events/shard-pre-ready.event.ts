import logger from '../helpers/logger';

export default {
  event: 'shardPreReady',
  generator: (id: number): void => {
    logger.info(`Shard ${id} finished processing the ready packet`);
  },
};
