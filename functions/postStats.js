const axios = require('axios');
const _ = require('lodash');

const logger = require('../lib/logger');

const config = require('../config');

const postStats = (id, serverCount) => {
    if (_.has(config, 'discordbotsorg')) {
        axios({
            method: 'post',
            url: `https://discordbots.org/api/bots/${id}/stats`,
            headers: {
                Authorization: config.discordbotsorg,
            },
            data: {
                server_count: serverCount,
            },
        })
            .catch(e => logger.warning(`Couldn't post stats to discordbots.org ${e}`));
    }

    if (_.has(config, 'botsdiscordpw')) {
        axios({
            method: 'post',
            url: `https://bots.discord.pw/api/bots/${id}/stats`,
            headers: {
                Authorization: config.botsdiscordpw,
            },
            data: {
                server_count: serverCount,
            },
        })
            .catch(e => logger.warning(`Couldn't post stats to bots.discord.pw ${e}`));
    }
};

module.exports = { postStats };
