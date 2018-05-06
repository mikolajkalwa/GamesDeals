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
                        return bot.createMessage(msg.channel.id, 'A webhook for this server already exists.');
                    }
                    else {
                        fs.readFile('../avatar.png', 'base64', (err, image) => {
                            if (err) {
                                logger.error(`Problem z odczytem obrazka dla webhooka ${err}`);
                                bot.createMessage(msg.channel.id, 'An error has occured. Please try again later.');
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
                                            .then(() => bot.createMessage(msg.channel.id, 'Channel has been set successfully.'))
                                            .catch(err => {
                                                logger.error(`Nie udalo sie dodac webhooka do bazy ${err}`);
                                                bot.createMessage(msg.channel.id, 'An error has occured. Please try again later.');
                                            });
                                    })
                                    .catch(err => {
                                        logger.error(`Nie udało się stworzyć webhooka ${err}`);
                                        bot.createMessage(msg.channel.id, 'An error has occured. Please try again later. Can\'t create webhook.');
                                    });
                            }
                        });
                    }
                })
                .catch(err => logger.error(`Nie mozna przeszukac webhookow ${err}`));
        },
        options: {
            deleteCommand: true,
            guildOnly: true,
            description: 'Set a channel for the bot (guild admins only)',
            fullDescription: 'Bot will send messages about free games in the channel where you use this command',
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