import logger from '../helpers/logger';

export default {
  event: 'error',
  generator: (err: Error, id: number): void => {
    logger.error({ err, shard: id, message: 'Error event occured' });
  },
};
