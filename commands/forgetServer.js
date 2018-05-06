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
                        bot.createMessage(msg.channel.id, 'Couldn\'t find any webhook related to this server');
                    }
                    else {
                        bot.deleteWebhook(result.id, result.token)
                            .then(() => bot.createMessage(msg.channel.id, 'Webhook zostal usuniety i bot nie bedzie juz tu wysylal wiadomosci'))
                            .catch(err => {
                                logger.error(`Blad z komendy forgetServer nie udalo sie usunac webhooka ${err}`);
                                bot.createMessage(msg.channel.id, 'Bot nie bedzie juz tu wysylal wiadomosci, ale musisz recznie usunac webhooka.');
                            });
                    }
                })
                .catch(err => {
                    bot.createMessage(msg.channel.id, 'An error has occured. Please try again later');
                    logger.error(`Nie udalo sie usunac webhooka z bazy ${err}`);
                });
        },
        options: {
            deleteCommand: true,
            guildOnly: true,
            description: 'Makes bot forget the server (guild admins only)',
            fullDescription: 'Bot won\'t send any messages about free games anymore',
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