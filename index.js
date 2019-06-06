/* eslint-disable no-await-in-loop */
const axios = require('axios');
const logger = require('pino')();
const isFree = require('./lib/isFree.js');

(async () => {
  try {
    const apiUrl = process.env.API_URL;
    const response = await axios.get('https://www.reddit.com/r/GameDeals/hot/.json?limit=3');
    if (response.status === 200) {
      const threads = response.data.data.children;
      const dealsToBroadcast = [];
      for (const thread of threads) { // eslint-disable-line no-restricted-syntax
        const { data: { id, url, title } } = thread;
        if (isFree(title)) {
          const getThreadFromDatabase = await axios.get(`${apiUrl}/deals/${id}`);
          if (getThreadFromDatabase.status === 204) {
            dealsToBroadcast.push({ title, url });
            await axios.post(`${apiUrl}/deals/`, {
              thread_id: id,
              title,
              url,
            });
          }
        }
      }
      logger.debug(dealsToBroadcast);
      if (dealsToBroadcast.length > 0) {
        let message = '';
        dealsToBroadcast.forEach((deal) => {
          message += `${deal.title} ${deal.url}\n`;
        });
        const executeWebhooks = await axios.post(`${apiUrl}/execute`, {
          message,
        });
        if (executeWebhooks.status === 202) {
          logger.info('ACCEPTED');
        } else {
          logger.warn(`Something went wrong during webhooks execution. Response status ${executeWebhooks.status}`);
        }
      }
    }
  } catch (e) {
    logger.error(e);
  }
})();
