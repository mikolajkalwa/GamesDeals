import { Job, Worker } from 'bullmq';
import pino from 'pino';
import { DiscordClient, GamesDealsApiClient } from './clients';
import { config } from './config';
import type { NotifyJob } from './types/notify-job.type';

const discordUrl = config.urls.discord;
const gamesDealsApiUrl = config.urls.gamesDeals;

const logger = pino({
  level: config.logLevel,
});

const gdApiClient = new GamesDealsApiClient(gamesDealsApiUrl);
const discordClient = new DiscordClient(discordUrl);

const worker = new Worker('notifications', async (job: Job<NotifyJob>) => {
  const response = await discordClient.executeWebhook({ id: job.data.webhook.id, token: job.data.webhook.token }, job.data.content, job.data.threadName);
  const body = await response.body.text();

  if (response.statusCode === 404 || response.statusCode === 401) {
    await gdApiClient.removeWebhook({ id: job.data.webhook.id }).catch((e) => { logger.error(e, 'failed to delete webhook'); });
  } else if (response.statusCode >= 500 && response.statusCode < 600) {
    logger.warn({ body, webhook: { id: job.data.webhook.id } }, 'Discord returned 5xx');
    throw new Error('Discord internal server error');
  } else if (response.statusCode === 429) {
    throw new Error('Webhook execution was ratelimited');
  } else if (response.statusCode === 400) {
    logger.warn({ body, webhook: { id: job.data.webhook.id } }, 'Discord returned 400');
  }
}, {
  concurrency: 100,
  autorun: true,
  connection: {
    host: config.redis.host,
    port: config.redis.port,
  },
});

worker.on('error', (e) => {
  logger.error(e, 'Worker errored');
});

process.on('SIGTERM', () => {
  (async () => {
    logger.info('SIGTERM signal received: closing queues');
    await worker.close();
    logger.info('All closed');
  })().catch((e) => { logger.error(e); });
});
