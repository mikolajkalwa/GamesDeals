'use strict';

const request = require('request');

const config = require('../config.js');

const getWeather = (latitude, longitude, callback) => {
    request({
        url: `https://api.darksky.net/forecast/${config.weather}/${latitude},${longitude}?lang=pl&units=si&exclude=minutely,hourly,flags,alerts`,
        json: true,
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            callback(undefined, {
                temperature: body.currently.temperature,
                apparentTemperature: body.currently.apparentTemperature,
                summary: body.daily.summary
            });
        } else {
            callback('Nie udało się pobrać informacji o pogodzie.');
        }
    });
};

module.exports = getWeather;