import './env';

import bot from './helpers/bot';
import loadEvents from './helpers/modulesLoader';

async function bootstrap() {
  loadEvents();

  await bot.connect();
  bot.editStatus('online', {
    name: 'for slash commands',
    type: 3,
  });
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
