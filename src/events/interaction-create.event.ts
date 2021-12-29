import { CommandInteraction, Interaction } from 'eris';
import { HTTPError } from 'got/dist/source';
import commands from '../commands';

import logger from '../helpers/logger';

export default {
  event: 'interactionCreate',
  // eslint-disable-next-line consistent-return
  generator: async (interaction: Interaction) => {
    if (interaction instanceof CommandInteraction) {
      const command = commands.get(interaction.data.name);

      if (!command) {
        await interaction.createMessage('Command not found');
        return logger.warn(`Command was not found ${interaction.data.name}`);
      }

      if (command.handler.guildOnly && !interaction.guildID) {
        return interaction.createMessage('This interaction can be used only within a guild server');
      }

      if (command.handler.requieredPermissions?.length) {
        const permission = interaction.member?.permissions;
        const hasPermissions = command.handler.requieredPermissions.every((x) => permission?.has(x));
        if (!hasPermissions) {
          return interaction.createMessage('You do not have sufficient permissions to issue this command.');
        }
      }

      command.handler.generator(interaction as CommandInteraction).catch((e) => {
        logger.error(e, `Failed to execute command: ${JSON.stringify(interaction.data)}}`);
        if (e instanceof HTTPError) {
          logger.error(`Response body: ${JSON.stringify(e.response.body)}`);
        }
      });
    }
  },
};
