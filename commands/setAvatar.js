const axios = require('axios');
const logger = require('../lib/logger');

const config = require('../config');

module.exports = (bot => {
    return {
        generator: (msg, args) => {
            if (args.length === 0) {
                msg.channel.createMessage('Invalid arguments or no arguments.');
            }
            else {
                axios.get(args[0], { responseType: 'arraybuffer' }).then(response => {
                    bot.editSelf({
                        avatar: `data:${response.headers['content-type']};base64,${Buffer.from(response.data, 'binary').toString('base64')}`
                    }).then(() => {
                        msg.channel.createMessage('Avatar has been changed!!');
                    }).catch(e => {
                        msg.channel.createMessage('There was an error during avatar change.');
                        logger.error(`There was an error during avatar change. ${e}`);
                    });
                }).catch(e => {
                    msg.channel.createMessage(`Can't fetch the image ${e.message}`);
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