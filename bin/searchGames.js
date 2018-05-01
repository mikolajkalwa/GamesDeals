'use strict';

const axios = require('axios');

const db = require('../lib/db');
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

                    if (~title.indexOf('free') || /100%/.test(title)) {
                        // Sprawdza czy deal jest w bazie. Jak nie to go dodaje i wysyla o nim info.
                        db.get(id)
                            .catch(err => {
                                if (err.notFound) {
                                    db.put(id, url)
                                        .then(() => {
                                            logger.info(`Dodano do bazy! ID: ${id}, Tytuł z reddita: ${title}, URL: ${url}`);
                                            sendDeals(topic.data.title, url);
                                        })
                                        .catch(err => logger.error(`Nie udalo sie dodac do bazy! ${err}`));
                                }
                                else {
                                    logger.info(`Nie mozna odczytac z bazy kod bledu:: ${err}`);
                                }
                            });

                        // Inkrementacja ilosci znaleziony deali (do bazy)
                        db.get('ilosc')
                            .then(value => {
                                db.put('ilosc', value + 1)
                                    .then(() => logger.info('Zaaktualizowano ilosc znalezionych deali!'))
                                    .catch(err => logger.error(`Nie udalo sie zaktualizowac ilosci deali! ${err}`));
                            })
                            .catch(err => logger.error(`Problem z odczytem wartosci ile dealow juz znalazl: ${err}`));
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