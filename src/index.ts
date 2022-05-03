import path from 'path';
import { Manager } from 'discord-hybrid-sharding';
import pino from 'pino';
import { Pushgateway, collectDefaultMetrics, Registry } from 'prom-client';
import config from './config';

const logger = pino({
  level: 'debug',
});

const manager = new Manager(path.resolve(__dirname, 'bot', 'bot.js'), {
  shardsPerClusters: 20,
  token: config.BOT_TOKEN,
});

manager.on('clusterCreate', (cluster) => logger.info(`Launched cluster ${cluster.id}`));

manager.spawn({ timeout: -1 }).catch((e) => {
  logger.error(e, 'Hybrid sharding maanger failed');
  process.exit(1);
});

if (config.PROMETHEUS_GATEWAY) {
  const register = new Registry();
  register.setDefaultLabels({ serviceName: 'cluster-manager' });
  collectDefaultMetrics({ register });
  const gateway = new Pushgateway(config.PROMETHEUS_GATEWAY, {}, register);

  setInterval(() => {
    gateway
      .push({ jobName: 'cluster-manager' })
      .catch((e) => logger.error(e, 'Failed to push manager metrics'));
  }, 5 * 1000);
}
