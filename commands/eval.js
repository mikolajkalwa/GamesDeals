const logger = require('../lib/logger');
const config = require('../config');
const { inspect } = require('util');

const clean = (text) => {
    if (typeof (text) === 'string') {
        return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
    }
    return text;
};

module.exports = (bot => ({
    generator: (msg, args) => {
        if (args.length === 0) {
            bot.createMessage(msg.channel.id, ':x: | Invalid arguments or no arguments.')
                .catch(e => logger.warn(`Unable to send a message ${e}`));
        }
        try {
            const code = args.join(' ');
            let evaled = eval(code); // eslint-disable-line

            if (typeof evaled !== 'string') {
                evaled = inspect(evaled);
            }

            bot.createMessage(msg.channel.id, clean(evaled))
                .catch(e => logger.warn(`Unable to send a message ${e}`));
        } catch (err) {
            logger.info(`ERROR ${clean(err)}`);
            bot.createMessage(msg.channel.id, `ERROR ${clean(err)}`)
                .catch(e => logger.warn(`Unable to send a message ${e}`));
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

