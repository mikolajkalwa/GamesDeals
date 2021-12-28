import { Client } from 'eris';

const bot = new Client(process.env.BOT_TOKEN, {
  // restMode: true,
  intents: ['guilds'],
  disableEvents: {
    TYPING_START: true,
    GUILD_BAN_ADD: true,
    GUILD_BAN_REMOVE: true,
    VOICE_STATE_UPDATE: true,
    MESSAGE_UPDATE: true,
  },
  largeThreshold: 50,
  maxShards: 'auto',
  messageLimit: 0,
});

export default bot;
