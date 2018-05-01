'use strict';

const config = require('../config');

module.exports = (bot => {
    return {
        generator: msg => {
            bot.createMessage(msg.channel.id, 'Pong!').then((msg2) => {
                msg2.edit({
                    content: 'Pong!',
                    embed: {
                        color: 0x48f442,
                        fields: [{
                            inline: true,
                            name: 'API',
                            value: `${msg2.timestamp - msg.timestamp}ms`
                        }, {
                            inline: true,
                            name: 'Websocket',
                            value: `${msg2.channel.guild.shard.latency}ms`
                        }],
                        timestamp: new Date(),
                    }
                });
            });
        },
        options: {
            description: 'Pong!',
            fullDescription: 'Use this command to check if bot is alive or not.',
            cooldown: 5 * 1000,
            cooldownMessage: 'You have to wait before using this command again.',
            cooldownExclusions: {
                userIDs: [config.ownerID]
            }
        }
    };
});