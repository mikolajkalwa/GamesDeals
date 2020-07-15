import './env';
import path from 'path';
import bot from './lib/bot';
import { loadCommands, loadEvents } from './lib/modulesLoader';

(async () => {
  path.resolve(__dirname, 'commands');
  await Promise.all([
    loadEvents(path.resolve(__dirname, 'events')),
    loadCommands(path.resolve(__dirname, 'commands')),
  ]);

  bot.connect();
})();
