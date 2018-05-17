const { mongoose } = require('../lib/db'); // eslint-disable-line
const { Webhook } = require('../models/webhook');

const logger = require('../lib/logger');
const config = require('../config');

module.exports = (bot => {
    return {
        generator: msg => {
            Webhook.findOneAndRemove({ guild_id: msg.channel.guild.id })
                .then(result => {
                    if (!result) {
                        bot.createMessage(msg.channel.id, ':x: | Couldn\'t find any webhook related to this server')
                            .catch(e => logger.warn(`Unable to send a message ${e}`));
                    }
                    else {
                        bot.deleteWebhook(result.id, result.token)
                            .then(() => {
                                bot.createMessage(msg.channel.id, ':white_check_mark: | Webhook has been removed and the bot won\'t send any messages to this channel anymore.')
                                    .catch(e => logger.warn(`Unable to send a message ${e}`));
                            })
                            .catch(err => {
                                logger.error(`Failed to delete webhook ${err}`);
                                bot.createMessage(msg.channel.id, ':warning: | The bot won\'t send any messages to this channel anymore, but you have to remove the webhook manually.')
                                    .catch(e => logger.warn(`Unable to send a message ${e}`));
                            });
                    }
                })
                .catch(err => {
                    bot.createMessage(msg.channel.id, ':exclamation: | An error has occured. Please try again later')
                        .catch(e => logger.warn(`Unable to send a message ${e}`));
                    logger.error(`Failed to remove webhook from database ${err}`);
                });
        },
        options: {
            cooldown: 60 * 1000,
            cooldownExclusions: {
                userIDs: [config.ownerID]
            },
            cooldownMessage: 'You have to wait before using this command again.',
            description: 'Makes the bot forget the server (guild admins only)',
            fullDescription: 'Bot won\'t send any messages about free games anymore',
            guildOnly: true,
            permissionMessage: 'You do not have sufficient permission to issue this command.',
            requirements: {
                permissions: {
                    'manageWebhooks': true
                }
            }
        }
    };
});