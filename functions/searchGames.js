const axios = require('axios');

const { mongoose } = require('../lib/db'); // eslint-disable-line
const { Deal } = require('../models/deal');

const logger = require('../lib/logger');

const { broadcast } = require('./broadcast');

const searchGames = () => {
    axios.get('https://www.reddit.com/r/GameDeals/hot/.json?limit=3')
        .then((response) => {
            if (response.status === 200) {
                const topics = response.data.data.children;
                topics.forEach((topic) => {
                    const { data: { id, url, title } } = topic;
                    if (title.toLowerCase().indexOf('free') > 0 || /100%/.test(title)) {
                        // Checks if topic already exists in db. If not, add it, and send to discord
                        Deal.findOne({ deal_id: id })
                            .then((result) => {
                                if (!result) {
                                    const deal = new Deal({
                                        deal_id: id,
                                        title,
                                        url,
                                    });
                                    deal.save()
                                        .then(() => {
                                            logger.info(`Added to mongoDB! ID: ${id}, Title: ${title}, URL: ${url}`);
                                            broadcast(`${title} ${url}`);
                                        })
                                        .catch(dbErr => logger.error(`Failed adding do mongoDB ${dbErr}`));
                                }
                            })
                            .catch(dbErr => logger.error(`Failed querying mongoDB ${dbErr}`));
                    }
                });
            } else {
                logger.warn(`Error fetching data from reddit: ${response.status}`);
            }
        })
        .catch((e) => {
            logger.error(`Unexpected error: ${e.message}`);
        });
};


module.exports = { searchGames };
