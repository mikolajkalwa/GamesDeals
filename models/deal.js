const mongoose = require('mongoose');

const Deal = mongoose.model('Deal', {
    dealID: {
        type: String,
        required: true,
        trim: true
    },
    title : {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true
    }
});

module.exports = {Deal};