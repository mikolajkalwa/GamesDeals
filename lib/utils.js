'use strict';

const axios = require('axios');

const db = require('./db');
const logger = require('./logger');
const bot = require('./bot');

const config = require('../config.js');

const searchGames = () => {
    axios.get('https://www.reddit.com/r/GameDeals/hot/.json?limit=4')
        .then(response => {
            if (response.status === 200) {
                const topics = response.data.data.children;
                topics.forEach(topic => {
                    const id = topic.data.id;
                    const title = topic.data.title.toLowerCase();
                    const url = topic.data.url;

                    const platforms = /gog|humble|steam|origin|ubisoft|uplay/;
                    const keywords = /100%|free/;
                    const ignore = /gogobundle|twitch prime/;

                    if (keywords.test(title) && platforms.test(title) && !ignore.test(title)) {
                        db.get(id, err => {
                            if (err) {
                                logger.info(`Raczej nie znaleziono w bazie ale dla pewnosci kod bledu: ${err}`);
                                db.put(id, url, err => {
                                    if (err) return logger.error(`Nie udalo sie dodac do bazy! ${err}`);
                                });
                                logger.info(`Dodano do bazy! ID: ${id}, Tytuł z reddita: ${title}, URL: ${url}`);
                                config.channels.forEach(channel => {
                                    bot.createMessage(channel, `${topic.data.title} ${url}`);
                                });
                            }
                        });
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


module.exports = {
    searchGames
};