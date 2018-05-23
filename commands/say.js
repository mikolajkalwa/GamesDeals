const { broadcast } = require('../functions/broadcast');

const config = require('../config');

module.exports = (() => ({
    generator: (msg, args) => {
        if (args.length === 0) {
            return 'Invalid arguments or no arguments.';
        }
        const toSay = args.join(' ');
        return broadcast(toSay);
    },
    options: {
        dmOnly: true,
        hidden: true,
        requirements: {
            userIDs: [config.ownerID],
        },
    },
}));
