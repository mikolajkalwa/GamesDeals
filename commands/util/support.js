const { Command } = require('discord.js-commando');

module.exports = class SupportCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'support',
      aliases: ['supp'],
      group: 'util',
      memberName: 'support',
      description: 'Sends support server invitation URL.',
    });
  }

  run(msg) { // eslint-disable-line class-methods-use-this
    msg.reply('https://discordapp.com/invite/Tgaag63');
  }
};
