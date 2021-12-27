import './env';

import bot from './lib/bot';
import loadEvents from './lib/modulesLoader';

async function bootstrap() {
  loadEvents();

  await bot.connect();
  bot.editStatus('online', {
    name: 'Use gd:help',
    type: 3,
  });
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
