import logger from '../helpers/logger';

export default {
  event: 'shardReady',
  generator: (id: number): void => {
    logger.info(`Shard ${id} turned ready`);
  },
};
