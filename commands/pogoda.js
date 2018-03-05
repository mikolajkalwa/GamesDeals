'use strict';

const axios = require('axios');

const logger = require('../lib/logger');
const config = require('../config.js');

module.exports = (() => {
    return {
        generator: (msg, args) => {
            let address;
            const miejsce = args.join(' ').trim();
            const encodedAddress = encodeURIComponent(miejsce);
            const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;
            axios.get(geocodeUrl).then((response) => {
                if (response.data.status === 'ZERO_RESULTS') {
                    return msg.channel.createMessage('Nie znaleziono adresu.');
                }
                const lat = response.data.results[0].geometry.location.lat;
                const lng = response.data.results[0].geometry.location.lng;
                address = response.data.results[0].formatted_address;
                const weatherUrl = `https://api.darksky.net/forecast/${config.weather}/${lat},${lng}?lang=pl&units=si&exclude=minutely,hourly,flags,alerts`;
                return axios.get(weatherUrl);
            }).then((response) => {
                const temperature = response.data.currently.temperature;
                const apparentTemperature = response.data.currently.apparentTemperature;
                const summary = response.data.daily.summary;
                msg.channel.createMessage(`Pogoda dla **${address}**:\nTemperatura: ${temperature}°C.\nOdczuwalana: ${apparentTemperature}°C.\n${summary}`);
            }).catch((e) => {
                if (e.code === 'ENOTFOUND') {
                    msg.channel.createMessage('Nie udało się pobrać informacji o pogodzie.');
                } else {
                    logger.error(e.message);
                }
            });
        }
    };
});