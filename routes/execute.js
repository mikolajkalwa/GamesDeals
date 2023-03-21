const Promise = require('bluebird');
const axios = require('axios');
const { Router } = require('express');
const Webhook = require('../models/Webhook.js');
const logger = require('../lib/logger.js');

const router = new Router();

router.post('/execute', (req, res) => {
  res.status(202).send();
  const { message } = req.body;
  Webhook.find({}).then((webhooks) => {
    Promise.map(webhooks, (webhook) => {
      let content = message;
      if (Object.prototype.hasOwnProperty.call(webhook.toObject(), 'role_to_mention')) {
        content = `${webhook.role_to_mention} ${message}`;
      }
      return axios.post(`https://discordapp.com/api/webhooks/${webhook.webhook_id}/${webhook.webhook_token}`, {
        content,
      }, {
        validateStatus: () => true, // doesn't reject promise when there is ANY response.
      });
    }, { concurrency: 30 }).then((responses) => {
      const webhooksToRemove = [];
      let rateLimitedWebhooks = 0;
      let failedWebhooks = 0;
      responses.forEach((response) => {
        const { statusCode } = response.request.res;
        if (statusCode === 404 || statusCode === 401) {
          const webhookID = response.config.url.split('/')[5];
          webhooksToRemove.push(webhookID);
        }
        if (statusCode === 429) {
          // TODO: implement some kind of throttling to prevent rate limiting.
          rateLimitedWebhooks += 1;
        }
        if (statusCode >= 500 && statusCode < 600) {
          // TODO: implement retry mechanism
          failedWebhooks += 1;
        }
      });
      // deletes invalid / outdated webhooks from the database
      Webhook.deleteMany({ webhook_id: { $in: webhooksToRemove } }).then((removedWebhooks) => {
        logger.info(`Removed webhooks: ${removedWebhooks.deletedCount}.
      Rate limited webhooks (didn't execute): ${rateLimitedWebhooks}.
      Webhooks which failed to execute: ${failedWebhooks}.`);
      }).catch(webhooksRemoveError => logger.error(`Webhooks failed to remove ${webhooksRemoveError}`));
    }).catch(webhookExecutionError => logger.error(`Webhooks failed to execute ${webhookExecutionError}`));
  }).catch(webhooksFindError => logger.error(`Mongoose failed to return webhooks ${webhooksFindError}`));
});

module.exports = router;
