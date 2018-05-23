const config = require('../config');
const logger = require('../lib/logger');

module.exports = (bot => ({
    generator: (msg) => {
        bot.createMessage(msg.channel.id, ':information_source: | Pong!').then((msg2) => {
            msg2.edit({
                content: ':information_source: | Pong!',
                embed: {
                    color: 0x48f442,
                    fields: [{
                        inline: true,
                        name: 'API',
                        value: `${msg2.timestamp - msg.timestamp}ms`,
                    }, {
                        inline: true,
                        name: 'Websocket',
                        value: `${msg2.channel.guild.shard.latency}ms`,
                    }],
                    timestamp: new Date(),
                },
            })
                .catch(e => logger.warn(`Unable to edit a message ${e}`));
        })
            .catch(e => logger.warn(`Unable to send a message ${e}`));
    },
    options: {
        cooldown: 5 * 1000,
        cooldownExclusions: {
            userIDs: [config.ownerID],
        },
        cooldownMessage: 'You have to wait before using this command again.',
        description: 'Pong!',
        fullDescription: 'Use this command to check if the bot is still alive or not.',
        guildOnly: true,
    },
}));
