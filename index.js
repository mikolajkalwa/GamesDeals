require('dotenv').config();
const logger = require('pino')();
const http = require('http');
const https = require('https');
const got = require('got');
const isFree = require('./lib/isFree.js');

const { API_URL } = process.env;

// limit concurrent requests
http.globalAgent.maxSockets = 30;
https.globalAgent.maxSockets = 30;

const fetchData = async () => {
  const response = await got.get('https://www.reddit.com/r/GameDeals/hot/.json?limit=3').json();
  return response.data.children.map((element) => {
    const {
      data: {
        id, url, title, author,
      },
    } = element;
    return {
      id, url, title, author,
    };
  });
};

const getDeals = async (redditData) => {
  const dealsArray = await Promise.all(redditData.map(async (thread) => {
    if (isFree(thread.title)) {
      const response = await got.get(`${API_URL}/deals/reddit/${thread.id}`, {
        throwHttpErrors: false,
      });

      if (response.statusCode === 404) {
        return thread;
      }
      return null;
    }
    return null;
  }));
  return dealsArray.filter(Boolean); // removes falsy falues from array
};

const insertDealsToDB = async ([...deals]) => {
  await Promise.all(deals.map(async (deal) => got.post(`${API_URL}/deals/`, {
    json: {
      redditId: deal.id,
      redditTitle: deal.title,
      gameUrl: deal.url,
    },
    responseType: 'json',
  })));
};

const createMessageContent = (deals) => {
  let message = '';
  deals.forEach((deal) => {
    message += `**${deal.title}**\n`;
    message += `<${deal.url}>\n`;
    message += `Posted by: *${deal.author}*\n`;
    message += `https://reddit.com/${deal.id}\n`;
  });
  return message;
};

const removeWebhooks = async (webhooks) => {
  await Promise.all(webhooks.map(async (webhook) => got.delete(`${API_URL}/webhooks/${webhook.webhookId}`)));
};

const executeWebhooks = async (webhooks, message) => {
  const webhooksToRemove = [];
  const rateLimitedWebhooks = [];
  const failedWebhooks = [];
  const badRequestWebhooks = [];
  await Promise.all(webhooks.map(async (webhook) => {
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

const getWebhooksToExecute = async (deals) => {
  const allWebhooks = await got.get(`${API_URL}/webhooks`).json();
  let mergedTitles = '';
  deals.forEach((deal) => {
    mergedTitles += `${deal.title.toLowerCase()} `;
  });

  const webhooksToExecute = allWebhooks.filter((webhook) => {
    if (webhook.keywords.length === 0) {
      return true;
    }
    // eslint-disable-next-line max-len
    const intersection = webhook.keywords.filter((keyword) => mergedTitles.includes(keyword.toLowerCase()));
    if (intersection.length) {
      return true;
    }
    return false;
  });

  return webhooksToExecute;
};

(async () => {
  try {
    const redditData = await fetchData();
    const dealsToAnnounce = await getDeals(redditData);
    if (dealsToAnnounce.length) {
      await insertDealsToDB(dealsToAnnounce);
      const message = createMessageContent(dealsToAnnounce);
      const webhooksToExecute = await getWebhooksToExecute(dealsToAnnounce);
      const executionResult = await executeWebhooks(webhooksToExecute, message);
      logger.info(`Webhooks to remove: ${executionResult.webhooksToRemove.length}`);
      logger.warn(`Rate-limited: ${executionResult.rateLimitedWebhooks.length}`);
      logger.warn(`Failed to execute: ${executionResult.failedWebhooks.length}`);
      logger.error(`Bad requests: ${executionResult.badRequestWebhooks.length}`);
      await removeWebhooks(executionResult.webhooksToRemove);
    }
  } catch (e) {
    logger.error(e);
  }
})();

process.on('unhandledRejection', (reason) => {
  throw reason;
});

process.on('uncaughtException', (error) => {
  logger.error(error);
  process.exit(1);
});
