const { Command } = require('discord.js-commando');
const axios = require('axios');
const logger = require('../../lib/logger.js');

const apiUrl = process.env.API_URL;

module.exports = class ForgetServerCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'forgetserver',
      aliases: ['fs'],
      group: 'set-up',
      memberName: 'forgetserver',
      description: 'Bot won\'t send any notifications about free games anymore.',
      guildOnly: true,
      clientPermissions: ['MANAGE_WEBHOOKS'],
      userPermissions: ['MANAGE_WEBHOOKS'],
      throttling: {
        usages: 2,
        duration: 60,
      },
    });
  }

  async run(msg) { // eslint-disable-line class-methods-use-this
    try {
      const response = await axios.delete(`${apiUrl}/webhooks/byguild/${msg.guild.id}`);
      if (response.status === 204) {
        return msg.reply(':x: | There are no webhooks related to this server.');
      }
      return msg.reply(':white_check_mark: | Webhook has been removed. Bot won\'t send any notifications to this channel anymore.');
    } catch (e) {
      logger.error(e);
      return msg.reply(':exclamation: | Oh no, something went wrong. Please try again later.');
    }
  }
};
