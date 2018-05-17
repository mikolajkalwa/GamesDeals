const axios = require('axios');

const { mongoose } = require('../lib/db'); // eslint-disable-line
const { Deal } = require('../models/deal');

const logger = require('../lib/logger');

const { broadcast } = require('./broadcast');

const searchGames = () => {
    axios.get('https://www.reddit.com/r/GameDeals/hot/.json?limit=3')
        .then(response => {
            if (response.status === 200) {
                const topics = response.data.data.children;
                topics.forEach(topic => {
                    const id = topic.data.id;
                    const title = topic.data.title.toLowerCase();
                    const url = topic.data.url;

                    if (~title.indexOf('free') || /100%/.test(title)) {
                        // Checks if topic already exists in db. If not, add it, and send to discord
                        Deal.findOne({ deal_id: id })
                            .then(result => {
                                if (!result) {
                                    const deal = new Deal({
                                        deal_id: id,
                                        title: topic.data.title,
                                        url
                                    });
                                    deal.save()
                                        .then(() => {
                                            logger.info(`Added to mongoDB! ID: ${id}, Title: ${topic.data.title}, URL: ${url}`);
                                            broadcast(`${topic.data.title} ${url}`);
                                        })
                                        .catch(err => logger.error(`Failed adding do mongoDB ${err}`));
                                }
                            })
                            .catch(err => logger.error(`Failed querying mongoDB ${err}`));
                    }
                });
            } else {
                logger.warn(`Error fetching data from reddit: ${response.status}`);
            }
        })
        .catch(e => {
            logger.error(`Unexpected error: ${e.message}`);
        });
};


module.exports = { searchGames };