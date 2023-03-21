const mongoose = require('mongoose');

const Webhook = mongoose.model('Webhook', {
    id: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    guild_id: {
        type: String,
        required: true,
        unique: true,
    },
});

module.exports = { Webhook };
