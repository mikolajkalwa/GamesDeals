import './env';

import path from 'path';
import { ShardingManager } from 'discord.js';
import pino from 'pino';

const logger = pino({
  level: 'debug',
});

const manager = new ShardingManager(path.resolve(__dirname, 'bot', 'bot.js'), { token: process.env.BOT_TOKEN });

manager.on('shardCreate', (shard) => logger.info(`Launched shard ${shard.id}`));

// eslint-disable-next-line @typescript-eslint/no-floating-promises
manager.spawn();
