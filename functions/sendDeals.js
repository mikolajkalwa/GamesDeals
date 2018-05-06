const axios = require('axios');

const { mongoose } = require('../lib/db'); // eslint-disable-line
const { Webhook } = require('../models/webhook');

const logger = require('../lib/logger');

const sendDeals = (title, url) => {
    Webhook.find()
        .then(webhooks => {
            webhooks.forEach(webhook => {
                axios.post(`https://discordapp.com/api/webhooks/${webhook.id}/${webhook.token}`, {
                    content: `${title} ${url}`
                })
                    .then(response => {
                        if (response.status === 404 || response.status === 401) {
                            Webhook.findOneAndRemove({ guild_id: webhook.guild.id })
                                .then(result => {
                                    if (!result) {
                                        logger.warning(`W bazie nie znaleziono webhooka ktory zwrocil ${response.status}`);
                                    }
                                    else {
                                        logger.info('Usunietego nieaktualnego webhooka z bazy');
                                    }
                                })
                                .catch(err => logger.error(`Problem przy czyszczeniu niekatulego webhooka ${err}`));
                        }
                    })
                    .catch(err => logger.error(`Problem przy odpalaniu webhooka ${webhook.guild_id}. Blad: ${err}`));
            });
        })
        .catch(err => logger.error(`Nie udalo sie pobrac webhookow z bazy ${err}`));
};

module.exports = sendDeals;