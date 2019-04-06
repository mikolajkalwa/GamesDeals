const { Command } = require('discord.js-commando');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../../lib/logger.js');

const apiUrl = process.env.API_URL;

module.exports = class SendHereCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'sendhere',
      aliases: ['sh'],
      group: 'set-up',
      memberName: 'sendhere',
      description: 'Set a channel for the bot.',
      details: 'Bot will send notifications about free games in the channel this command was issued.',
      guildOnly: true,
      clientPermissions: ['MANAGE_WEBHOOKS'],
      userPermissions: ['MANAGE_WEBHOOKS'],
      throttling: {
        usages: 2,
        duration: 60,
      },
      args: [{
        key: 'roleToMention',
        prompt: 'Please specify what role should be mentioned',
        error: 'Argument must be a role.',
        type: 'role',
        default: {},
      }],
    });
  }

  async run(msg, args) { // eslint-disable-line class-methods-use-this
    try {
      const response = await axios.get(`${apiUrl}/webhooks/byguild/${msg.guild.id}`);

      if (response.status === 204) {
        const image = await fs.readFile(path.resolve(__dirname, '..', '..', 'assets', 'avatar.png'), 'base64');
        const webhook = await msg.channel.createWebhook('Games Deals', `data:image/png;base64,${image}`);
        await axios.post(`${apiUrl}/webhooks/`, {
          webhook_id: webhook.id,
          webhook_token: webhook.token,
          guild_id: webhook.guildID,
          role_to_mention: Object.prototype.hasOwnProperty.call(args.roleToMention, 'name') ? `@${args.roleToMention.name}` : undefined,
        });
        return msg.reply(':white_check_mark: | Channel has been set successfully!');
      }
      return msg.reply(':x: | Webhook for this server already exists!');
    } catch (e) {
      logger.error(e);
      return msg.reply(':exclamation: | Oh no, something went wrong. Please try again later.');
    }
  }
};
