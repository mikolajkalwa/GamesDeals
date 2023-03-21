const logger = require('../lib/logger');

const config = require('../config');

module.exports = (bot => ({
    generator: (message) => {
        if (!message.author.bot && message.content === `<@${config.botID}>`) {
            bot.createMessage(message.channel.id, `<@${message.author.id}> my prefix is \`${config.prefix}\` For more info use \`_help\``)
                .catch(msgErr => logger.warning(`Cant send prefix ${msgErr}`));
        }
    },
}));
