import logger from '../lib/logger';

export default {
  event: 'shardReady',
  generator: (id: number): void => {
    logger.info(`Shard ${id} turned ready`);
  },
};