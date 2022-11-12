import { ShardingManager } from 'discord.js';
import path from 'path';
import pino from 'pino';
import { collectDefaultMetrics, Pushgateway, Registry } from 'prom-client';
import config from './config';

const logger = pino({
  level: 'info',
});

const manager = new ShardingManager(path.resolve(__dirname, 'bot', 'bot.js'), {
  token: config.BOT_TOKEN,
});

manager.on('shardCreate', (shard) => logger.info(`Launched shard ${shard.id}`));

manager.spawn().catch((e) => {
  logger.error(e, 'Sharding manager failed');
  process.exit(1);
});

if (config.PROMETHEUS_GATEWAY) {
  const register = new Registry();
  register.setDefaultLabels({ serviceName: 'sharding-manager' });
  collectDefaultMetrics({ register });
  const gateway = new Pushgateway(config.PROMETHEUS_GATEWAY, {}, register);

  setInterval(() => {
    gateway
      .push({ jobName: 'sharding-manager' })
      .catch((e) => logger.error(e, 'Failed to push manager metrics'));
  }, 5 * 1000);
}
