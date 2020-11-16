/* eslint-disable no-await-in-loop */
import './lib/env';

import http from 'http';
import https from 'https';
import got from 'got';
import logger from './lib/logger';
import isFree from './lib/isFree';
import getWebhooksToExecute from './lib/getWebhooksToExecute';
import { RedditResponse } from './models/RedditResponse';
import { Deal } from './models/Deal';
import { Webhook } from './models/Webhook';
import { ExecutionResult } from './models/ExecutionResult';
import reportExecutionResult from './lib/reportExecutionResult';

const { API_URL, WEBHOOK_URL, MENTION } = process.env;

// limit concurrent requests
http.globalAgent.maxSockets = 30;
https.globalAgent.maxSockets = 30;

const fetchRedditThreads = async (): Promise<Deal[]> => {
  const response: RedditResponse = await got.get('https://www.reddit.com/r/GameDeals/hot/.json?limit=3').json();
  return response.data.children.map((element) => {
    const {
      data: {
        id, url, title, author, over_18: over18,
      },
    } = element;
    return {
      id, url, title, author, over18,
    };
  });
};

const getDealsToAnnounce = async (deals: Deal[]): Promise<Deal[]> => {
  const isNewDeal = async (deal: Deal) => {
    if (deal.over18) {
      return false; // ignore all nsfw threads
    }

    if (isFree(deal.title)) {
      const response = await got.get(`${API_URL}/deals/reddit/${deal.id}`, {
        throwHttpErrors: false,
      });

      if (response.statusCode === 404) {
        return true;
      }
      return false;
    }
    return false;
  };

  return deals.filter(isNewDeal);
};

const insertDealsToDB = async ([...deals]: Deal[]) => {
  await Promise.all(deals.map(async (deal) => got.post(`${API_URL}/deals/`, {
    json: {
      redditId: deal.id,
      redditTitle: deal.title,
      gameUrl: deal.url,
    },
    responseType: 'json',
  })));
};

const createMessageContent = (deal: Deal) => {
  let message = '';
  message += `**${deal.title}**\n`;
  message += `<${deal.url}>\n`;
  message += `Posted by: *${deal.author}*\n`;
  message += `https://reddit.com/${deal.id}\n`;

  return message;
};

const removeWebhooks = async (webhooks: Webhook[]) => {
  await Promise.allSettled(webhooks.map(async (webhook) => got.delete(`${API_URL}/webhooks/${webhook.webhookId}`)));
};

const executeWebhooks = async (webhooks: Webhook[], message: string): Promise<ExecutionResult> => {
  const webhooksToRemove: Webhook[] = [];
  const rateLimitedWebhooks: Webhook[] = [];
  const failedWebhooks: Webhook[] = [];
  const badRequestWebhooks: Webhook[] = [];
  await Promise.allSettled(webhooks.map(async (webhook) => {
    let content = message;
    if (Object.prototype.hasOwnProperty.call(webhook, 'roleToMention')) {
      content = `${webhook.roleToMention} ${message}`;
    }

    const response = await got.post(`https://discord.com/api/webhooks/${webhook.webhookId}/${webhook.webhookToken}`, {
      json: {
        content,
      },
      throwHttpErrors: false,
    });
    if (response.statusCode === 404 || response.statusCode === 401) {
      webhooksToRemove.push(webhook);
    } else if (response.statusCode >= 500 && response.statusCode < 600) {
      failedWebhooks.push(webhook);
    } else if (response.statusCode === 429) {
      rateLimitedWebhooks.push(webhook);
    } else if (response.statusCode === 400) {
      badRequestWebhooks.push(webhook);
    }
    return response;
  }));
  return {
    webhooksToRemove, rateLimitedWebhooks, failedWebhooks, badRequestWebhooks,
  };
};

(async () => {
  try {
    const redditData = await fetchRedditThreads();
    const dealsToAnnounce = await getDealsToAnnounce(redditData);
    if (dealsToAnnounce.length === 0) {
      return;
    }

    await insertDealsToDB(dealsToAnnounce);
    const allWebhooks: Webhook[] = await got.get(`${API_URL}/webhooks`).json();

    // eslint-disable-next-line no-restricted-syntax
    for (const deal of dealsToAnnounce) {
      const message = createMessageContent(deal);
      const webhooksToExecute = getWebhooksToExecute(deal, allWebhooks);
      const executionResult = await executeWebhooks(webhooksToExecute, message);
      logger.info(`Webhooks to remove: ${executionResult.webhooksToRemove.length}`);
      logger.warn(`Rate-limited: ${executionResult.rateLimitedWebhooks.length}`);
      logger.warn(`Failed to execute: ${executionResult.failedWebhooks.length}`);
      logger.error(`Bad requests: ${executionResult.badRequestWebhooks.length}`);
      await removeWebhooks(executionResult.webhooksToRemove);
      await reportExecutionResult(WEBHOOK_URL, MENTION, executionResult);
    }
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
