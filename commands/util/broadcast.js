const { Command } = require('discord.js-commando');
const axios = require('axios');

const logger = require('../../lib/logger.js');

const apiUrl = process.env.API_URL;

module.exports = class BroadcastCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'broadcast',
      group: 'util',
      memberName: 'broadcast',
      description: 'Executes ALL webhooks with given message',
      ownerOnly: true,
      hidden: true,
      args: [{
        key: 'message',
        prompt: 'Provide message to be send',
        error: 'Argument must be a string.',
        type: 'string',
      }],
    });
  }

  async run(msg, args) { // eslint-disable-line class-methods-use-this
    try {
      if (msg.author.id !== '172012484306141184') {
        return msg.reply('You are not authorized to use this command!');
      }

      const response = await axios.post(`${apiUrl}/execute`, {
        message: args.message,
      });
      return msg.reply(`Completed!
      Removed webhooks: ${response.data.removedWebhooks.deletedCount}.
      Rate limited webhooks (didn't execute): ${response.data.rateLimitedWebhooks}.
      Webhooks which failed to execute: ${response.data.failedWebhooks}.`);
    } catch (e) {
      logger.error(e);
      return msg.reply('Something went wrong!');
    }
  }
};
