const { broadcast } = require('../functions/broadcast');
const logger = require('../lib/logger');
const config = require('../config');

module.exports = (bot => ({
    generator: (msg, args) => {
        if (args.length === 0) {
            bot.createMessage(msg.channel.id, ':x: | Invalid arguments or no arguments.')
                .catch(e => logger.warning(`Unable to send a message ${e}`));
        }
        const toSay = args.join(' ');
        broadcast(toSay);
    },
    options: {
        dmOnly: true,
        hidden: true,
        requirements: {
            userIDs: [config.ownerID],
        },
    },
}));
