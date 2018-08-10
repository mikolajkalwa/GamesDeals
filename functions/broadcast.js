// needs refactor

const axios = require('axios');
const _ = require('lodash');

const logger = require('../lib/logger');

const { Webhook } = require('../models/webhook');

const { removeWebhook } = require('./removeWebhook');

const milisecondsInTenMinutes = 600000;
let failed = 0;
let interval = 0;


const gatewayErrorHandler = (webhook, content) => {
    if (failed < 10) {
        logger.info('Cant execute webhook. Trying again...');
        if (interval < milisecondsInTenMinutes) {
            interval += milisecondsInTenMinutes;
        }
        retry(webhook, content); // eslint-disable-line
    } else {
        logger.warn(`Tried ${failed} times, failed`);
    }
};


const retry = (webhook, content) => {
    setTimeout(() => {
        axios.post(`https://discordapp.com/api/webhooks/${webhook.id}/${webhook.token}`, {
            content,
        })
            .catch((webhookExecuteErr) => {
                const { response: { status } } = webhookExecuteErr;
                if (status === 404 || status === 401) {
                    removeWebhook(webhook.id);
                } else if (status === 502) {
                    failed += 1;
                    gatewayErrorHandler(webhook, content);
                } else {
                    logger.error(`Failed executing webhook. Guild: ${webhook.guild_id}. Error: ${webhookExecuteErr}`);
                }
            });
    }, interval);
};

const broadcast = (...message) => {
    const content = _.unescape(message.join(' '));
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
                        } else if (status === 502) {
                            failed += 1;
                            gatewayErrorHandler(webhook, content);
                        } else {
                            logger.error(`Failed executing webhook. Guild: ${webhook.guild_id}. Error: ${webhookExecuteErr}`);
                        }
                    });
            });
        })
        .catch(err => logger.error(`Failed fetching webhooks from database ${err}`));
};

module.exports = { broadcast };
