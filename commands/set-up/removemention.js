const { Command } = require('discord.js-commando');
const axios = require('axios');
const logger = require('../../lib/logger.js');

const apiUrl = process.env.API_URL;

module.exports = class RemoveMentionCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'removemention',
      aliases: ['rm'],
      group: 'set-up',
      memberName: 'removemention',
      description: 'Makes bot stop mentioning a role when a new game is found.',
      guildOnly: true,
      userPermissions: ['MANAGE_WEBHOOKS'],
      throttling: {
        usages: 2,
        duration: 60,
      },
    });
  }

  async run(msg) { // eslint-disable-line class-methods-use-this
    try {
      const response = await axios.get(`${apiUrl}/webhooks/byguild/${msg.guild.id}`);

      if (response.status === 200) {
        await axios.patch(`${apiUrl}/webhooks/byguild/${msg.guild.id}`, {
          role_to_mention: undefined,
        });
        return msg.reply(':white_check_mark: | Role to mention has been updated successfully!');
      }

      if (response.status === 204) {
        return msg.reply(':x: | Webhook for this server doesn\'t exists!');
      }

      return msg.reply(':exclamation: | Oh no, something went wrong. Please try again later.');
    } catch (e) {
      logger.error(e);
      return msg.reply(':exclamation: | Oh no, something went wrong. Please try again later.');
    }
  }
};
