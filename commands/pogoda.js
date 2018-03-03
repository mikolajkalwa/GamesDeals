'use strict';

const logger = require('../lib/logger');
const weather = require('../lib/weather.js');
const geocode = require('../lib/geocode.js');

module.exports = (() => {
    return {
        generator: (msg, args) => {
            const miejsce = args.join(' ');
            geocode(miejsce, (errorMessage, results) => {
                if (errorMessage) {
                    logger.error(errorMessage);
                    msg.channel.createMessage(errorMessage);
                } else {
                    weather(results.latitude, results.longitude, (errorMessage, weatherResults) => {
                        if (errorMessage) {
                            logger.error(errorMessage);
                            msg.channel.createMessage(errorMessage);
                        } else {
                            msg.channel.createMessage(`Pogoda dla **${results.address}**:\nTemperatura: ${weatherResults.temperature}°C.\nOdczuwalana: ${weatherResults.apparentTemperature}°C\n${weatherResults.summary}`);
                        }
                    });
                }
            });
        }
    };
});