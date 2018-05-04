const axios = require('axios');

const {mongoose} = require('../lib/db'); // eslint-disable-line
const {Deal} = require('../models/deal');

const logger = require('../lib/logger');

const sendDeals = require('./sendDeals');

const searchGames = () => {
    axios.get('https://www.reddit.com/r/GameDeals/hot/.json?limit=3')
        .then(response => {
            if (response.status === 200) {
                const topics = response.data.data.children;
                topics.forEach(topic => {
                    const id = topic.data.id;
                    const title = topic.data.title.toLowerCase();
                    const url = topic.data.url;

                    if (~title.indexOf('destiny') || /100%/.test(title)) {
                        // Sprawdza czy deal jest w bazie. Jak nie to go dodaje i wysyla o nim info.
                        Deal.findOne({dealID: id})
                            .then(result => {
                                if (!result) {
                                    const deal = new Deal({
                                        dealID: id,
                                        title: topic.data.title,
                                        url
                                    });
                                    deal.save()
                                        .then(() => {
                                            logger.info(`Dodano do bazy! ID: ${id}, Tytuł z reddita: ${title}, URL: ${url}`);
                                            sendDeals(topic.data.title, url);
                                        })
                                        .catch(err => logger.error(`Nie udalo sie dodac do bazy! ${err}`));
                                }
                            })
                            .catch(err => logger.error(`Blad przy zapytaniu do bazy ${err}`));
                    }
                });
            } else {
                logger.warn(`Nie udało się pobrać danych z reddita :c Kod odpowiedzi HTTP: ${response.status}`);
            }
        })
        .catch(e => {
            logger.error(e.message);
        });
};


module.exports = searchGames;