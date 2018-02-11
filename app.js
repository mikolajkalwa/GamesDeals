const request = require('request');
const Eris = require('eris');
const levelup = require('levelup');
const leveldown = require('leveldown');

const config = require('./config.js');

const bot = new Eris.CommandClient(config.token, {}, {
    description: 'Super bot co ma brać z reddita info o darmowych gierkach na gogu, humble\'u i steamie, ale nie wiem do końca czy na 100% działa',
    owner: 'Mikey#6819',
    prefix: '_'
});

const db = levelup(leveldown('./deals'));

bot.on('ready', () => {
    console.log('Ready!');
});

bot.registerCommand('ping', (msg) => {
    bot.createMessage(msg.channel.id, 'Pong!').then((msg2) => {
        msg2.edit({
            content: 'Pong!',
            embed: {
                color: 0x48f442,
                fields: [{
                    inline: true,
                    name: 'API',
                    value: `${msg2.timestamp - msg.timestamp}ms`
                }, {
                    inline: true,
                    name: 'Websocket',
                    value: `${msg2.channel.guild.shard.latency}ms`
                }],
                timestamp: new Date(),
            }
        });
    });
});


setInterval(() => {
    request({
        url: 'https://www.reddit.com/r/GameDeals/.json?limit=10',
        json: true,
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const topics = body.data.children;
            topics.forEach(topic => {
                const title = topic.data.title.toLowerCase();
                let url = topic.data.url;

                const platforms = /gog|humble|steam|origin/;
                const keywords = /100%|pwyw|free/;
                const ignore = /gogobundle/;

                if (keywords.test(title) && platforms.test(title) && !ignore.test(title)) {
                    db.get(title, err => {
                        if (err) {
                            console.log('Raczej nie znaleziono w bazie ale dla pewnosci kod bledu:', err);
                            db.put(title, url, err => { 
                                if (err) return console.log('Nie udalo sie dodac do bazy!', err);
                            });
                            console.log('Dodano do bazy!', title,':', url);
                            if(/free weekend/.test(title))
                                url = `Free weekend ${url}`;

                            bot.createMessage(config.channelMikis, url);
                            bot.createMessage(config.channelSGZ, url);
                        }
                    });
                }
            });
        } else {
            if (error) {
                bot.createMessage(config.channelMikis, `Nie udało się pobrać danych z reddita :c ${error}`);
            } else {
                bot.createMessage(config.channelMikis, `Nie udało się pobrać danych z reddita :c StatusCode: ${response.statusCode}`);
            }
        }
    });
}, 5 * 60 * 1000);

bot.connect();