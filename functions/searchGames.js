const axios = require('axios');

const { Deal } = require('../models/deal');

const logger = require('../lib/logger');

const { broadcast } = require('./broadcast');

const searchGames = () => {
    axios.get('https://www.reddit.com/r/GameDeals/hot/.json?limit=3')
        .then((response) => {
            if (response.status === 200) {
                const threads = response.data.data.children;
                threads.forEach((thread) => {
                    const { data: { id, url, title } } = thread;
                    if (title.toLowerCase().includes('free') || title.includes('100%')) {
                        // Checks if thread already in db
                        Deal.findOne({ id })
                            .then((result) => {
                                if (!result) { // if thread doesnt exists in db, add it
                                    const deal = new Deal({ id, title, url });
                                    deal.save()
                                        .then(() => {
                                            logger.info(`Added to mongoDB! ID: ${id}, Title: ${title}, URL: ${url}`);
                                            broadcast(title, url);
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
