import './env';
import path from 'path';
import got from 'got';
import bot from './lib/bot';
import { loadCommands, loadEvents } from './lib/modulesLoader';
import Time from './lib/Time';

(async () => {
  path.resolve(__dirname, 'commands');
  await Promise.all([
    loadEvents(path.resolve(__dirname, 'events')),
    loadCommands(path.resolve(__dirname, 'commands')),
  ]);

  await bot.connect();
  bot.editStatus('online', {
    name: 'Use gd:help',
    type: 3,
  });

  if (process.env.BOT_ID && process.env.TOPGG_TOKEN) {
    setInterval(async () => {
      await got.post(`https://top.gg/api/bots/${process.env.BOT_ID}/stats`, {
        json: {
          server_count: bot.guilds.size,
        },
        headers: {
          Authorization: process.env.TOPGG_TOKEN,
        },
      });
    }, 30 * Time.MINUTE);
  }
})();
