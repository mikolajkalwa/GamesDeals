import { Job, Worker } from 'bullmq';
import closeWithGrace from 'close-with-grace';
import { GamesDealsApiClient } from 'gd-api-client';
import pino from 'pino';
import { DiscordClient } from './clients';
import { config } from './config';
import { Processor } from './processor';
import type { NotifyJob } from './types/notify-job.type';

const discordUrl = config.urls.discord;
const gamesDealsApiUrl = config.urls.gamesDeals;

const logger = pino({
  level: config.logLevel,
});

const gdApiClient = new GamesDealsApiClient(gamesDealsApiUrl);
const discordClient = new DiscordClient(discordUrl);
const processor = new Processor(gdApiClient, discordClient, logger);

const worker = new Worker('notifications', async (job: Job<NotifyJob>) => {
  await processor.executeWebhook(job);
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

closeWithGrace(async ({ err }) => {
  if (err) {
    logger.error({ err }, 'closing worker due to error');
  }
  logger.info('shutting down, closing queues');
  await worker.close();
});
