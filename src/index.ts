import 'reflect-metadata';
import './lib/env';

import { container } from 'tsyringe';
import http from 'http';
import https from 'https';
import { Logger } from 'pino';
import { setTimeout } from 'timers/promises';
import logger from './lib/logger';
import { GamesDealsAPIClient, IGamesDealsAPIClient } from './GamesDealsAPIClient';
import { DiscordClient, IDiscordClient } from './DiscordClient';
import { IRedditClient, RedditClient } from './RedditClient';
import { INotifier, Notifier } from './Notifier';

http.globalAgent.maxSockets = 64;
https.globalAgent.maxSockets = 64;

const resultsWebhook = process.env.WEBHOOK_URL;
const discordUrl = process.env.DISCORD_URL || 'https://discord.com';
const gamesDealsApiUrl = process.env.GAMES_DEALS_API_URL || 'http://localhost:3000';
const redditBaseUrl = process.env.REDDIT_URL || 'https://reddit.com';

(async () => {
  container.register('discordBaseUrl', { useValue: discordUrl });
  container.register('gdApiBaseUrl', { useValue: gamesDealsApiUrl });
  container.register('redditBaseUrl', { useValue: redditBaseUrl });

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

    logger.info(`Deals to announce ${JSON.stringify(dealsToAnnounce)}`);

    await Promise.allSettled(dealsToAnnounce.map(async (deal) => {
      try {
        await gdApiClient.insertNewDeal(deal);
        const executionResult = await notifier.announceDeal(deal, allWebhooks);
        await notifier.cleanupInvalidWebhooks(executionResult.webhooksToRemove);
        await notifier.reportExecutionResult(executionResult, resultsWebhook);

        if (executionResult.failedWebhooks.length > 0) {
          await setTimeout(15000);

          const retryResult = await notifier.announceDeal(deal, executionResult.failedWebhooks);
          if (executionResult.failedWebhooks.length === retryResult.failedWebhooks.length) {
            logger.warn('After 15 seconds the same webhooks failed to execute.');
          }

          const failedWebhooksIDs = retryResult.failedWebhooks.map((webhook) => webhook.id);
          logger.warn(`Failed webhooks ids: ${failedWebhooksIDs.join(', ')}`);
          await notifier.reportExecutionResult(retryResult, resultsWebhook);
        }
      } catch (e: any) {
        logger.error(e);
      }
    }));
  } catch (e: any) {
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
