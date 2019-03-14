const mongoose = require('mongoose');

const Webhook = mongoose.model('Webhook', {
  webhook_id: {
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
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

module.exports = Webhook;
