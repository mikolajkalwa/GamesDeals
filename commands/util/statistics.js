const moment = require('moment');
const axios = require('axios');
const { Command } = require('discord.js-commando');

const logger = require('../../lib/logger.js');

const apiUrl = process.env.API_URL;

module.exports = class StatisticsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'statistics',
      aliases: ['stats', 'stat'],
      group: 'util',
      memberName: 'statistics',
      description: 'Sends basic statistics about the bot.',
      throttling: {
        usages: 1,
        duration: 60,
      },
    });
  }

  async run(msg) { // eslint-disable-line class-methods-use-this
    try {
      const { data: { createdWebhooks } } = await axios(`${apiUrl}/webhooks/amount`);
      const { data: { foundDeals } } = await axios(`${apiUrl}/deals/amount`);
      const guilds = await this.client.shard.fetchClientValues('guilds.size');
      const guildAmount = guilds.reduce((acc, cur) => acc + cur);
      const stats = `:robot: **Uptime:** ${moment.duration(this.client.uptime).locale('en').humanize()},\n`
        + `:desktop: **Servers:** ${guildAmount},\n`
        + `:postbox: **Webhooks:** ${createdWebhooks},\n`
        + `:video_game: **Found Games:** ${foundDeals}`;
      return msg.reply(`\n${stats}`);
    } catch (e) {
      logger.error(e);
      return msg.reply(':exclamation: | Oh no, something went wrong. Please try again later.');
    }
  }
};
