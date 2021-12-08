import './env';

import got from 'got';
import bot from './lib/bot';
import loadEvents from './lib/modulesLoader';
import Time from './helpers/Time';

async function bootstrap() {
  loadEvents();

  await bot.connect();
  bot.editStatus('online', {
    name: 'Use gd:help',
    type: 3,
  });

  if (process.env.BOT_ID && process.env.TOPGG_TOKEN) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setInterval(async () => {
      await got.post(`https://top.gg/api/bots/${process.env.BOT_ID as string}/stats`, {
        json: {
          server_count: bot.guilds.size,
        },
        headers: {
          Authorization: process.env.TOPGG_TOKEN,
        },
      });
    }, 30 * Time.MINUTE);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
