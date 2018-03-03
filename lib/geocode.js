'use strict';

const request = require('request');

const geocodeAddress = (address, callback) => {
    const encodedAddress = encodeURIComponent(address.trim());
    request({
        url: `http://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`,
        json: true,
    }, (error, response, body) => {
        if (error) {
            callback('Nie udało się połączyć z serwerami Google.');
        } else if (body.status === 'ZERO_RESULTS') {
            callback('Nie znaleziono adresu.');
        } else if (body.status === 'OK') {
            callback(undefined, {
                address: body.results[0].formatted_address,
                latitude: body.results[0].geometry.location.lat,
                longitude: body.results[0].geometry.location.lng,
            });
        }
    });
};

module.exports = geocodeAddress;