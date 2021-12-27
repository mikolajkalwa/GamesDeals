import './env';

import bot from './lib/bot';
import commands from './commands';

// eslint-disable-next-line @typescript-eslint/no-misused-promises
bot.on('ready', async () => {
  console.log('Ready!');
  const definitions = Array.from(commands.values()).map((x) => x.definition);
  await bot.bulkEditGuildCommands('527065903926345728', definitions);
  const existingCommands = await bot.getCommands();
  console.log(existingCommands);
  process.exit(0);
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bot.connect();
