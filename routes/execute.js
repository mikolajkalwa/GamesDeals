const axios = require('axios');
const { Router } = require('express');
const Webhook = require('../models/Webhook.js');

const router = new Router();

router.post('/execute', async (req, res) => {
  try {
    let { message } = req.body;
    const webhooks = await Webhook.find({});
    const promiseArray = webhooks.map((webhook) => {
      if (Object.prototype.hasOwnProperty.call(webhook.toObject(), 'role_to_mention')) {
        message = `${webhook.role_to_mention} ${message}`;
      }
      return axios.post(`https://discordapp.com/api/webhooks/${webhook.webhook_id}/${webhook.webhook_token}`, {
        content: message,
      });
    });
    const responses = await Promise.all(promiseArray.map(p => p.catch(e => e)));
    const webhooksToRemove = [];
    responses.forEach((response) => {
      const { statusCode } = response.request.res;
      if (statusCode === 404 || statusCode === 401) {
        const webhookID = response.config.url.split('/')[5];
        webhooksToRemove.push(webhookID);
      }
    });
    const removedWebhooks = await Webhook.deleteMany({ webhook_id: { $in: webhooksToRemove } });
    res.status(200).send({ removedWebhooks });
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
