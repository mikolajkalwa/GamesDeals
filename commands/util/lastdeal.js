const moment = require('moment');
const axios = require('axios');
const { Command } = require('discord.js-commando');

const logger = require('../../lib/logger.js');

const apiUrl = process.env.API_URL;

module.exports = class LastDealCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'lastdeal',
      aliases: ['ld'],
      group: 'util',
      memberName: 'lastdeal',
      description: 'Sends information about last found game.',
      throttling: {
        usages: 1,
        duration: 60,
      },
    });
  }

  timestamp(objectId) { // eslint-disable-line class-methods-use-this
    const date = new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
    return moment(date).format('YYYY-MM-DD');
  }

  async run(msg) {
    try {
      const response = await axios(`${apiUrl}/deals/lastDeal`);
      const lastDeal = response.data;
      const message = `**:calendar: Date:** ${this.timestamp(lastDeal._id)}\n` // eslint-disable-line no-underscore-dangle
        + `**:video_game: Title:** ${lastDeal.title}\n`
        + `**:mouse_three_button: URL:** ${lastDeal.url}`;
      return msg.reply(`\n${message}`);
    } catch (e) {
      logger.error(e);
      return msg.reply(':exclamation: | Oh no, something went wrong. Please try again later.');
    }
  }
};
