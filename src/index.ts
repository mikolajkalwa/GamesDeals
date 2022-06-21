import 'dotenv/config';
import pino from 'pino';
import { setTimeout } from 'timers/promises';
import DiscordClient from './DiscordClient';
import GamesDealsAPIClient from './GamesDealsAPIClient';
import Notifier from './Notifier';
import RedditClient from './RedditClient';

const resultsWebhook = process.env.WEBHOOK_URL;
const discordUrl = process.env.DISCORD_URL || 'https://discord.com';
const gamesDealsApiUrl = process.env.GAMES_DEALS_API_URL || 'http://localhost:3000';
const redditUrl = process.env.REDDIT_URL || 'https://reddit.com';

const logger = pino({
  level: process.env.LOG_LEVEL || 'debug',
});

const redditClient = new RedditClient(redditUrl);
const gdApiClient = new GamesDealsAPIClient(gamesDealsApiUrl);
const discordClient = new DiscordClient(discordUrl);
const notifier = new Notifier(logger, gdApiClient, discordClient);

(async () => {
  try {
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
      } catch (e) {
        logger.error(e);
      }
    }));
  } catch (e) {
    logger.error(e);
  }
})().catch((e) => {
  logger.error(e, 'main function crashed');
  process.exit(1);
});
