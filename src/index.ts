import pino from 'pino';
import { setTimeout } from 'timers/promises';
import {
  DiscordClient, GamesDealsApiClient, NotifierClient, RedditClient,
} from './clients';
import { config } from './config';

const webhookUrl = config.urls.webhook;
const discordUrl = config.urls.discord;
const redditUrl = config.urls.reddit;
const gamesDealsApiUrl = config.urls.gamesDeals;

const logger = pino({
  level: config.logLevel,
});

const redditClient = new RedditClient(redditUrl);
const gdApiClient = new GamesDealsApiClient(gamesDealsApiUrl);
const discordClient = new DiscordClient(discordUrl);
const notifierClient = new NotifierClient(logger, gdApiClient, discordClient);

(async () => {
  try {
    const trendingDeals = await redditClient.getTrendingDeals();
    const allWebhooks = await gdApiClient.getAllWebhooks();
    const dealsToAnnounce = await notifierClient.getDealsToAnnounce(trendingDeals);

    logger.info(`Deals to announce ${JSON.stringify(dealsToAnnounce)}`);

    await Promise.allSettled(dealsToAnnounce.map(async (deal) => {
      try {
        await gdApiClient.insertNewDeal(deal);
        const executionResult = await notifierClient.announceDeal(deal, allWebhooks);
        await notifierClient.cleanupInvalidWebhooks(executionResult.webhooksToRemove);
        await notifierClient.reportExecutionResult(executionResult, webhookUrl);

        if (executionResult.failedWebhooks.length > 0) {
          await setTimeout(15000);

          const retryResult = await notifierClient.announceDeal(deal, executionResult.failedWebhooks);
          if (executionResult.failedWebhooks.length === retryResult.failedWebhooks.length) {
            logger.warn('After 15 seconds the same webhooks failed to execute.');
          }

          const failedWebhooksIDs = retryResult.failedWebhooks.map((webhook) => webhook.id);
          logger.warn(`Failed webhooks ids: ${failedWebhooksIDs.join(', ')}`);
          await notifierClient.reportExecutionResult(retryResult, webhookUrl);
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
