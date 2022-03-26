import './env';

import path from 'path';
import { Manager } from 'discord-hybrid-sharding';
import pino from 'pino';
import { Pushgateway, collectDefaultMetrics, Registry } from 'prom-client';

const logger = pino({
  level: 'debug',
});

const register = new Registry();
register.setDefaultLabels({ serviceName: 'cluster-manager' });
collectDefaultMetrics({ register });
const gateway = new Pushgateway(process.env.PROMETHEUS_GATEWAY, {}, register);

const manager = new Manager(path.resolve(__dirname, 'bot', 'bot.js'), {
  shardsPerClusters: 10000,
  token: process.env.BOT_TOKEN,
});

manager.on('clusterCreate', (cluster) => logger.info(`Launched cluster ${cluster.id}`));

// eslint-disable-next-line @typescript-eslint/no-floating-promises
manager.spawn({ timeout: -1 });

setInterval(() => {
  gateway
    .push({ jobName: 'cluster-manager' })
    .then(() => logger.debug('Metrics pushed'))
    .catch((e) => logger.error(e, 'Failed to push manager metrics'));
}, 5 * 1000);
