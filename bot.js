const path = require('path');
const { CommandoClient } = require('discord.js-commando');
const axios = require('axios');
const logger = require('./lib/logger.js');

const commandPrefix = process.env.COMMAND_PREXIF || 'gd:';

const bot = new CommandoClient({
  owner: '172012484306141184',
  commandPrefix,
  invite: 'https://discord.gg/Tgaag63',
  disabledEvents: [
    'TYPING_START',
    'MESSAGE_REACTION_ADD',
    'MESSAGE_REACTION_REMOVE',
    'MESSAGE_REACTION_REMOVE_ALL',
    'CHANNEL_PINS_UPDATE',
  ],
  messageCacheMaxSize: 10,
});


function setActivity() {
  bot.user.setActivity(`Use ${commandPrefix}help`);
}

bot.on('error', e => logger.error(`[Shard ${bot.shard.id}] ${e}`));
bot.on('warn', info => logger.warn(`[Shard ${bot.shard.id}] ${info}`));
bot.on('ready', () => {
  logger.info(`Shard ${bot.shard.id} is ready!`);
  setActivity();
});
bot.on('disconnect', () => logger.warn(`Shard ${bot.shard.id} has disconnected!`));
bot.on('reconnecting', () => logger.info(`Shard ${bot.shard.id} is reconnecting!`));
bot.on('resume', () => {
  logger.info(`Shard ${bot.shard.id} has reconnected!`);
  setActivity();
});
bot.on('rateLimit', rateLimitInfo => logger.warn(rateLimitInfo));
bot.on('guildCreate', async () => {
  if (process.env.DISCORD_BOTS_ORG || process.env.DISCORD_BOTS_GG) {
    try {
      const guilds = await bot.shard.fetchClientValues('guilds.size');
      const shardCount = guilds.length;
      const guildCount = guilds.reduce((acc, cur) => acc + cur);
      if (process.env.DISCORD_BOTS_ORG) {
        await axios({
          method: 'post',
          url: `https://discordbots.org/api/bots/${bot.user.id}/stats`,
          headers: {
            Authorization: process.env.DISCORD_BOTS_ORG,
          },
          data: {
            server_count: guildCount,
            shard_count: shardCount,
          },
        });
      }
      if (process.env.DISCORD_BOTS_GG) {
        await axios({
          method: 'post',
          url: `https://discord.bots.gg/api/v1/bots/${bot.user.id}/stats`,
          headers: {
            Authorization: process.env.DISCORD_BOTS_GG,
          },
          data: {
            guildCount,
            shardCount,
          },
        });
      }
    } catch (error) {
      logger.error(error);
    }
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


setInterval(() => {
  const sweptUsersCount = bot.users.sweep(u => u.presence.status === 'offline');
  logger.info(`[Shard ${bot.shard.id}] Swept ${sweptUsersCount} users.`);
}, 60 * 60 * 1000);


bot.login(process.env.BOT_TOKEN);

module.exports = bot;
