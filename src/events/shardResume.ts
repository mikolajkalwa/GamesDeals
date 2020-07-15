import logger from '../lib/logger';

export default {
  event: 'shardResume',
  generator: (id: number): void => {
    logger.info(`Shard ${id} resumed`);
  },
};
