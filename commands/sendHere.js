const fs = require('fs');
const { mongoose } = require('../lib/db'); // eslint-disable-line
const { Webhook } = require('../models/webhook');

const logger = require('../lib/logger');
const config = require('../config');

// TODO: dodać przypadek w error hnadlingu na to że serw już jest w bazie.

module.exports = (bot => {
    return {
        generator: msg => {
            Webhook.findOne({ guild_id: msg.channel.guild.id })
                .then(result => {
                    if (result) {
                        return bot.createMessage(msg.channel.id, ':x: | A webhook for this server already exists.');
                    }
                    else {
                        fs.readFile('./avatar.png', 'base64', (err, image) => {
                            if (err) {
                                logger.error(`Failed reading avatar file ${err}`);
                                bot.createMessage(msg.channel.id, ':exclamation: | An error has occured. Please try again later.');
                                return;
                            }
                            else {
                                msg.channel.createWebhook({
                                    name: 'Games Deals',
                                    avatar: `data:image/png;base64,${image}`
                                })
                                    .then(createdWebhook => {
                                        const webhookToAdd = new Webhook({
                                            id: createdWebhook.id,
                                            token: createdWebhook.token,
                                            guild_id: createdWebhook.guild_id
                                        });
                                        webhookToAdd.save()
                                            .then(() => bot.createMessage(msg.channel.id, ':white_check_mark: | Channel has been set successfully.'))
                                            .catch(err => {
                                                logger.error(`Failed adding webhook to database ${err}`);
                                                bot.createMessage(msg.channel.id, ':exclamation: | An error has occured. Please try again later.');
                                            });
                                    })
                                    .catch(err => {
                                        logger.warn(`Failed creating webhook ${err}`);
                                        bot.createMessage(msg.channel.id, ':exclamation: | This feature requires permission to manage webhooks. Please grant this permission in Server Settings for GamesDeals role.');
                                    });
                            }
                        });
                    }
                })
                .catch(err => logger.error(`Failed getting webhooks from database ${err}`));
        },
        options: {
            guildOnly: true,
            description: 'Set a channel for the bot (guild admins only)',
            fullDescription: 'The bot will send messages about free games in the channel this command was issued.',
            cooldown: 60 * 1000,
            cooldownExclusions: {
                userIDs: [config.ownerID]
            },
            cooldownMessage: 'You have to wait before using this command again.',
            requirements: {
                permissions: {
                    'administrator': true
                }
            }
        }
    };
});