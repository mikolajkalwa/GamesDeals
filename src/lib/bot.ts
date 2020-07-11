import { CommandClient } from 'eris';

const description = `A bot to notify about games which price were reduced by 100%.
Add it to your server and never miss any sale again!
If you are interested in game sales, check out <https://www.reddit.com/r/GameDeals/>
**This bot is still under active development and sometimes may break due to my coding skills.**`;

const bot = new CommandClient(process.env.BOT_TOKEN, {
  disableEvents: {
    TYPING_START: true,
    GUILD_BAN_ADD: true,
    GUILD_BAN_REMOVE: true,
    VOICE_STATE_UPDATE: true,
    MESSAGE_UPDATE: true,
  },
  guildSubscriptions: false,
  largeThreshold: 50,
  maxShards: 'auto',
  messageLimit: 10,

}, {
  name: 'GamesDeals',
  owner: 'Miki',
  prefix: ['@mention', 'gd:'],
  description,
});

export default bot;
