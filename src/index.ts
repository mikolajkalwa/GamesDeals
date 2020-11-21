import 'reflect-metadata';
import './lib/env';

import { container } from 'tsyringe';
import http from 'http';
import https from 'https';
import { Logger } from 'pino';
import logger from './lib/logger';
import { GamesDealsAPIClient, IGamesDealsAPIClient } from './GamesDealsAPIClient';
import { DiscordClient, IDiscordClient } from './DiscordClient';
import { IRedditClient, RedditClient } from './RedditClient';
import { INotifier, Notifier } from './Notifier';
import sleep from './lib/sleep';

http.globalAgent.maxSockets = 30;
https.globalAgent.maxSockets = 30;

const resultsWebhook = process.env.WEBHOOK_URL;

(async () => {
  container.register<Logger>('Logger', {
    useValue: logger,
  });

  container.register<IGamesDealsAPIClient>('IGamesDealsAPIClient', {
    useClass: GamesDealsAPIClient,
  });
  container.register<IDiscordClient>('IDiscordClient', {
    useClass: DiscordClient,
  });
  container.register<IRedditClient>('IRedditClient', {
    useClass: RedditClient,
  });
  container.register<INotifier>('INotifier', {
    useClass: Notifier,
  });

  try {
    const notifier = container.resolve(Notifier);
    const redditClient = container.resolve(RedditClient);
    const gdApiClient = container.resolve(GamesDealsAPIClient);

    const trendingDeals = await redditClient.getTrendingDeals();
    const allWebhooks = await gdApiClient.getAllWebhooks();
    const dealsToAnnounce = await notifier.getDealsToAnnounce(trendingDeals);

    await Promise.allSettled(dealsToAnnounce.map(async (deal) => {
      const executionResult = await notifier.announceDeal(deal, allWebhooks);
      await notifier.cleanupInvalidWebhooks(executionResult.webhooksToRemove);
      await notifier.reportExecutionResult(executionResult, resultsWebhook);

      // todo: implement appropriate retry mechanism
      if (executionResult.failedWebhooks.length > 0) {
        await sleep(3000);
        const retryResult = await notifier.announceDeal(deal, executionResult.failedWebhooks);
        if (executionResult.failedWebhooks.length === retryResult.failedWebhooks.length) {
          logger.warn('After 3 seconds the same webhooks failed to execute.');
        }
        const failedWebhooksIDs = retryResult.failedWebhooks.map((webhook) => webhook.webhookId);
        logger.warn(`Failed webhooks ids: ${failedWebhooksIDs.join(', ')}`);
      }
    }));
  } catch (e) {
    logger.error(e);
  }
})();

process.on('unhandledRejection', (reason) => {
  // eslint-disable-next-line @typescript-eslint/no-throw-literal
  throw reason;
});

process.on('uncaughtException', (error) => {
  logger.error(error);
  process.exit(1);
});
