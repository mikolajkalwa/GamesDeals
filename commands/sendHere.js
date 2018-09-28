const fs = require('fs');

const { Webhook } = require('../models/webhook');

const logger = require('../lib/logger');
const config = require('../config');

module.exports = (bot => ({
    generator: (msg) => {
        Webhook.findOne({ guild_id: msg.channel.guild.id })
            .then((result) => {
                if (result) {
                    bot.createMessage(msg.channel.id, ':x: | A webhook for this server already exists.')
                        .catch(e => logger.warning(`Unable to send a message ${e}`));
                } else {
                    fs.readFile('./avatar.png', 'base64', (err, image) => {
                        if (err) {
                            logger.error(`Failed reading avatar file ${err}`);
                            bot.createMessage(msg.channel.id, ':exclamation: | An error has occured. Please try again later.')
                                .catch(e => logger.warning(`Unable to send a message ${e}`));
                        } else {
                            msg.channel.createWebhook({
                                name: 'Games Deals',
                                avatar: `data:image/png;base64,${image}`,
                            })
                                .then((createdWebhook) => {
                                    const webhookToAdd = new Webhook({
                                        id: createdWebhook.id,
                                        token: createdWebhook.token,
                                        guild_id: createdWebhook.guild_id,
                                    });
                                    webhookToAdd.save()
                                        .then(() => {
                                            bot.createMessage(msg.channel.id, ':white_check_mark: | Channel has been set successfully.')
                                                .catch(e => logger.warning(`Unable to send a message ${e}`));
                                        })
                                        .catch((dbErr) => {
                                            logger.error(`Failed adding webhook to database ${dbErr}`);
                                            bot.createMessage(msg.channel.id, ':exclamation: | An error has occured. Please try again later.')
                                                .catch(e => logger.warning(`Unable to send a message ${e}`));
                                        });
                                })
                                .catch((webhookErr) => {
                                    logger.warning(`Failed creating webhook ${webhookErr}`);
                                    bot.createMessage(msg.channel.id, ':exclamation: | This feature requires permission to manage webhooks. Please grant this permission in Server Settings for GamesDeals role.')
                                        .catch(e => logger.warning(`Unable to send a message ${e}`));
                                });
                        }
                    });
                }
            })
            .catch(err => logger.error(`Failed getting webhooks from database ${err}`));
    },
    options: {
        cooldown: 60 * 1000,
        cooldownExclusions: {
            userIDs: [config.ownerID],
        },
        cooldownMessage: 'You have to wait before using this command again.',
        description: 'Set a channel for the bot (requires permission to manage webhooks)',
        fullDescription: 'The bot will send messages about free games in the channel this command was issued.',
        guildOnly: true,
        permissionMessage: 'You do not have sufficient permission to issue this command. (manage webhooks)',
        requirements: {
            permissions: {
                manageWebhooks: true,
            },
        },
    },
}));
