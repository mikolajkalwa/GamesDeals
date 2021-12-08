import './env';

import bot from './lib/bot';
import commands from './commands';

// eslint-disable-next-line @typescript-eslint/no-misused-promises
bot.on('ready', async () => {
  console.log('Ready!');
  const existingCommands = await bot.getCommands();
  console.log(existingCommands);
  if (!existingCommands.length) {
    await bot.bulkEditCommands(Array.from(commands.values()));
  }

  process.exit(0);
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bot.connect();
