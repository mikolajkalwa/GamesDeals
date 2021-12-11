import './env';

import bot from './lib/bot';
import commands from './commands';

// eslint-disable-next-line @typescript-eslint/no-misused-promises
bot.on('ready', async () => {
  console.log('Ready!');
  await bot.bulkEditGuildCommands('527065903926345728', Array.from(commands.values()));
  const existingCommands = await bot.getCommands();
  console.log(existingCommands);
  process.exit(0);
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bot.connect();
