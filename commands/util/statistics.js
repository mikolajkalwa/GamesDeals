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
      const { data: { createdWebhooks: webhooksCount } } = await axios(`${apiUrl}/webhooks/amount`);
      const { data: { foundDeals: dealsCount } } = await axios(`${apiUrl}/deals/amount`);
      const guilds = await this.client.shard.fetchClientValues('guilds.size');
      const users = await this.client.shard.broadcastEval('this.guilds.reduce((prev, guild) => prev + guild.memberCount, 0)');
      const guildsCount = guilds.reduce((acc, cur) => acc + cur);
      const usersCount = users.reduce((prev, memberCount) => prev + memberCount, 0);
      const stats = `:robot: **Uptime:** ${moment.duration(this.client.uptime).locale('en').humanize()},\n`
        + `:desktop: **Servers:** ${guildsCount},\n`
        + `:family: **Users:** ${usersCount}\n`
        + `:postbox: **Webhooks:** ${webhooksCount},\n`
        + `:video_game: **Found Games:** ${dealsCount}`;
      return msg.reply(`\n${stats}`);
    } catch (e) {
      logger.error(e);
      return msg.reply(':exclamation: | Oh no, something went wrong. Please try again later.');
    }
  }
};
