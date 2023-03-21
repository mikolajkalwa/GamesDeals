const { Command } = require('discord.js-commando');

module.exports = class InviteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'invite',
      aliases: ['inv'],
      group: 'util',
      memberName: 'invite',
      description: 'Sends bot invitation URL.',
    });
  }

  run(msg) { // eslint-disable-line class-methods-use-this
    msg.reply('https://discordapp.com/oauth2/authorize?client_id=396466836331429889&scope=bot&permissions=536890368');
  }
};
