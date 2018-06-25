const logger = require('../lib/logger');
const { postStats } = require('../functions/postStats');

module.exports = (bot => ({
    generator: (guild) => {
        const msg = `Thank you for adding me into your Discord Server.
            If you want me to send information about discounted games, you need to show me where I should do it.
            Just use \`_sendHere\` command in the channel where you desire me to send messages.
            (It won't work in DMs, run it in a Server Channel.)`.trim();
        bot.getDMChannel(guild.ownerID) // doest it make sense to send this message to server owner?
            .then((channel) => {
                bot.createMessage(channel.id, msg).catch(e => logger.warn(`Unable to send a message ${e}`));
            })
            .catch(e => logger.error(`Unable to get DM channel ${e}`));
        postStats(bot.user.id, bot.guilds.size);
    },
}));
