import logger from '../helpers/logger';

export default {
  event: 'shardResume',
  generator: (id: number): void => {
    logger.info(`Shard ${id} resumed`);
  },
};
