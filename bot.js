const path = require('path');
const { Client } = require('discord.js-commando');
const axios = require('axios');
const logger = require('./lib/logger.js');

const commandPrefix = process.env.COMMAND_PREXIF || 'gd:';

const bot = new Client({
  owner: '172012484306141184',
  commandPrefix,
  invite: 'https://discord.gg/Tgaag63',
});

function setActivity() {
  bot.user.setActivity(`Use ${commandPrefix}help`);
}

bot.on('error', e => logger.error(e));
bot.on('warn', info => logger.warn(info));
bot.on('ready', () => {
  logger.info('Ready!');
  setActivity();
});
bot.on('disconnect', () => logger.warn('Disconnected!'));
bot.on('reconnecting', id => logger.info(`Shard ${id} is reconnecting!`));
bot.on('resume', () => {
  logger.info('Reconnected!');
  setActivity();
});
bot.on('rateLimit', rateLimitInfo => logger.warn(rateLimitInfo));
bot.on('guildCreate', async () => {
  try {
    if (process.env.DISCORD_BOTS_ORG || process.env.DISCORD_BOTS_GG) {
      const guilds = await this.client.shard.fetchClientValues('guilds.size');
      const guildAmount = guilds.reduce((acc, cur) => acc + cur);
      if (process.env.DISCORD_BOTS_ORG) {
        await axios({
          method: 'post',
          url: `https://discordbots.org/api/bots/${bot.user.id}/stats`,
          headers: {
            Authorization: process.env.DISCORD_BOTS_ORG,
          },
          data: {
            server_count: guildAmount,
          },
        });
      }
      if (process.env.DISCORD_BOTS_GG) {
        axios({
          method: 'post',
          url: `https://bots.discord.pw/api/bots/${bot.user.id}/stats`,
          headers: {
            Authorization: process.env.DISCORD_BOTS_GG,
          },
          data: {
            server_count: guildAmount,
          },
        });
      }
    }
  } catch (error) {
    logger.error(error);
  }
});


bot.registry
  .registerDefaultTypes()
  .registerDefaultGroups()
  .registerDefaultCommands({
    prefix: false,
    eval_: false,
    commandState: false,
  })
  .registerGroups([
    ['set-up', 'Bot set-up commands.'],
  ])
  .registerCommandsIn(path.resolve(__dirname, 'commands'));

bot.login(process.env.BOT_TOKEN);

module.exports = bot;
