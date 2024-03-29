import { ShardingManager } from 'discord.js';
import path from 'path';
import pino from 'pino';
import config from './config';

const logger = pino({
  level: config.LOG_LEVEL ?? 'info',
});

const manager = new ShardingManager(path.resolve(__dirname, 'bot', 'bot.js'), {
  token: config.BOT_TOKEN,
  respawn: true,
  mode: 'worker',
});

manager.on('shardCreate', (shard) => {
  logger.info(`Launched shard ${shard.id}`);
  shard.on('spawn', () => logger.info(`Shard ${shard.id} was spawned.`));
  shard.on('ready', () => logger.info(`Shard ${shard.id} is ready.`));
  shard.on('death', () => logger.error(`Shard ${shard.id} died.`));
  shard.on('disconnect', () => logger.warn(`Shard ${shard.id} disconnected.`));
  shard.on('reconnecting', () => logger.warn(`Shard ${shard.id} is reconnecting.`));
});

manager.spawn().catch((e) => {
  logger.error(e, 'Sharding manager failed');
  process.exit(1);
});
