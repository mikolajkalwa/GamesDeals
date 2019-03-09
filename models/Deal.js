const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

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
    validate(value) {
      if (!isURL(value)) {
        throw new Error('URL is invalid');
      }
    },
  },
});

module.exports = Deal;
