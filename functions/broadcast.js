const axios = require('axios');

const { Webhook } = require('../models/webhook');

const logger = require('../lib/logger');

const { removeWebhook } = require('./removeWebhook');

const broadcast = (...message) => {
    const content = message.join(' ');
    Webhook.find()
        .then((webhooks) => {
            webhooks.forEach((webhook) => {
                axios.post(`https://discordapp.com/api/webhooks/${webhook.id}/${webhook.token}`, {
                    content,
                })
                    .catch((webhookExecuteErr) => {
                        const { response: { status } } = webhookExecuteErr;
                        if (status === 404 || status === 401) {
                            removeWebhook(webhook.id);
                        } else {
                            logger.error(`Failed executing webhook. Guild: ${webhook.guild_id}. Error: ${webhookExecuteErr}`);
                        }
                    });
            });
        })
        .catch(err => logger.error(`Failed fetching webhooks from database ${err}`));
};

module.exports = { broadcast };
