const mongoose = require('mongoose');

const Deal = mongoose.model('Deal', {
    id: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    url: {
        type: String,
        required: true,
    },
});

module.exports = { Deal };
