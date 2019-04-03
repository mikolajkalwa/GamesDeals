const axios = require('axios');
const { Router } = require('express');
const Webhook = require('../models/Webhook.js');

const router = new Router();

router.post('/execute', async (req, res) => {
  try {
    const { message } = req.body;
    const webhooks = await Webhook.find({});
    const promiseArray = webhooks.map((webhook) => {
      let content = message;
      if (Object.prototype.hasOwnProperty.call(webhook.toObject(), 'role_to_mention')) {
        content = `${webhook.role_to_mention} ${message}`;
      }
      return axios.post(`https://discordapp.com/api/webhooks/${webhook.webhook_id}/${webhook.webhook_token}`, {
        content,
      });
    });
    const responses = await Promise.all(promiseArray.map(p => p.catch(e => e)));
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
    const removedWebhooks = await Webhook.deleteMany({ webhook_id: { $in: webhooksToRemove } });
    res.status(200).send({ removedWebhooks, rateLimitedWebhooks, failedWebhooks });
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
