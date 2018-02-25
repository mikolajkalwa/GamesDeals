'use strict';

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
        }
    };
});