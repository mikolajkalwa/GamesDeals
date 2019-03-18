const { Schema, model } = require('mongoose');

const webhookSchema = new Schema({
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
  role_to_mention: {
    type: String,
    required: false,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

const Webhook = model('Webhook', webhookSchema);

module.exports = Webhook;
