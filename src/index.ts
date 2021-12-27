import './env';

import bot from './lib/bot';
import loadEvents from './lib/modulesLoader';

async function bootstrap() {
  loadEvents();

  await bot.connect();
  bot.editStatus('online', {
    // TODO: add /help command
    name: 'for slash commands. Use /help',
    type: 3,
  });
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
