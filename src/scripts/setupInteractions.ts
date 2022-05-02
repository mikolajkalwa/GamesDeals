import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import config from '../config';
import commands from '../bot/commands';

const definitions = Array.from(commands.values()).map((x) => x.definition.toJSON());
const clientId = '904077341846818888';
const guildId = '527065903926345728';

const rest = new REST({ version: '10' }).setToken(config.BOT_TOKEN);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: definitions },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
