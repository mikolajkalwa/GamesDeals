const config = require('../config');
const logger = require('../lib/logger');

module.exports = (bot => ({
    generator: (msg, args) => {
        if (args.length === 0) {
            msg.channel.createMessage('Invalid arguments or no arguments.')
                .catch(e => logger.warning(`Unable to send a message ${e}`));
        } else {
            const newName = args.join(' ');
            bot.editSelf({ username: newName }).then(() => {
                msg.channel.createMessage('Username has been changed!')
                    .catch(e => logger.warning(`Unable to send a message ${e}`));
            }).catch((editSelfErr) => {
                msg.channel.createMessage('There was an error during username change.')
                    .catch(e => logger.warning(`Unable to send a message ${e}`));
                logger.error(`There was an error during username change. ${editSelfErr}`);
            });
        }
    },
    options: {
        dmOnly: true,
        hidden: true,
        requirements: {
            userIDs: [config.ownerID],
        },
    },
}));
