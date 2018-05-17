const axios = require('axios');

const { mongoose } = require('../lib/db'); // eslint-disable-line
const { Webhook } = require('../models/webhook');

const logger = require('../lib/logger');

const broadcast = (message) => {
    Webhook.find()
        .then(webhooks => {
            webhooks.forEach(webhook => {
                axios.post(`https://discordapp.com/api/webhooks/${webhook.id}/${webhook.token}`, {
                    content: message
                })
                    .catch(err => {
                        if (err.response.status === 404 || err.response.status === 401) {
                            Webhook.findOneAndRemove({ guild_id: webhook.guild_id })
                                .then(result => {
                                    if (!result) {
                                        logger.warning(`Webhook has returned ${err.response.status}, but cant be found in database`);
                                    }
                                    else {
                                        logger.info('Removed an outdated webhook from the database');
                                    }
                                })
                                .catch(err => logger.error(`Failed removing outdated webhook. Guild: ${webhook.guild_id} Error: ${err}`));
                        }
                        else {
                            logger.error(`Failed executing webhook. Guild: ${webhook.guild_id}. Error: ${err}`);
                        }
                    });
            });
        })
        .catch(err => logger.error(`Failed fetching webhooks from database ${err}`));
};

module.exports = { broadcast };