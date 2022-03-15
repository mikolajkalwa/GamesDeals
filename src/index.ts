import './env';

import path from 'path';
import { ShardingManager } from 'discord.js';
import pino from 'pino';
import { Pushgateway, collectDefaultMetrics, Registry } from 'prom-client';

const logger = pino({
  level: 'debug',
});

const register = new Registry();
register.setDefaultLabels({ serviceName: 'sharding-manager' });
collectDefaultMetrics({ register });
const gateway = new Pushgateway(process.env.PROMETHEUS_GATEWAY, {}, register);

const manager = new ShardingManager(path.resolve(__dirname, 'bot', 'bot.js'), { token: process.env.BOT_TOKEN });
manager.on('shardCreate', (shard) => logger.info(`Launched shard ${shard.id}`));

// eslint-disable-next-line @typescript-eslint/no-floating-promises
manager.spawn();

setInterval(() => {
  gateway.push({ jobName: 'sharding-manager' })
    .then(() => logger.debug('Metrics pushed'))
    .catch((e) => logger.error(e));
}, 5 * 1000);
