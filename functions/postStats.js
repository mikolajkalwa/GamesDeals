const has = Object.prototype.hasOwnProperty;

const axios = require('axios');
const config = require('../config');

const postStats = (id, serverCount) => {
    if (has.call(config, 'discordbotsorg')) {
        axios({
            method: 'post',
            url: `https://discordbots.org/api/bots/${id}/stats`,
            headers: {
                Authorization: config.discordbotsorg,
            },
            data: {
                server_count: serverCount,
            },
        });
    }
};

module.exports = { postStats };
