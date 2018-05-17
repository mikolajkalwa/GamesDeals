const { broadcast } = require('../functions/broadcast');

const config = require('../config');

module.exports = (() => {
    return {
        generator: (msg, args) => {
            if (args.length === 0)
                return 'Invalid arguments or no arguments.';
            else {
                const toSay = args.join(' ');
                broadcast(toSay);
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