const config = require('../config');
const logger = require('../lib/logger');

module.exports = (bot => {
    return {
        generator: (msg, args) => {
            if (args.length === 0) {
                return msg.channel.createMessage('Invalid arguments or no arguments.');
            }
            else {
                const newName = args.join(' ');
                bot.editSelf({ username: newName }).then(() => {
                    msg.channel.createMessage('Username has been changed!');
                }).catch(e => {
                    msg.channel.createMessage('There was an error during username change.');
                    logger.error(`There was an error during username change. ${e}`);
                });
            }
        },
        options: {
            dmOnly: true,
            hidden: true,
            requirements: {
                userIDs: [config.ownerID]
            }
        }
    };
});