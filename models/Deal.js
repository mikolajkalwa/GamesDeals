const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const Deal = mongoose.model('Deal', {
  thread_id: {
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
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

module.exports = Deal;
