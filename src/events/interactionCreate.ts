import { CommandInteraction, Interaction } from 'eris';
import commands from '../commands';

import logger from '../lib/logger';

export default {
  event: 'interactionCreate',
  // eslint-disable-next-line consistent-return
  generator: async (interaction: Interaction) => {
    if (interaction instanceof CommandInteraction) {
      const command = commands.get(interaction.data.name);

      if (!command) {
        return logger.warn(`Command was not found ${interaction.data.name}`);
      }

      if (command.guildOnly && !interaction.guildID) {
        return interaction.createMessage('This interaction can be used only within a guild server');
      }

      if (command.requieredPermissions?.length) {
        const permission = interaction.member?.permissions;
        const hasPermissions = command.requieredPermissions.every((x) => permission?.has(x));
        if (!hasPermissions) {
          return interaction.createMessage('You do not have sufficient permissions to issue this command.');
        }
      }

      command.generator(interaction as CommandInteraction).catch((e) => {
        logger.error(e, `Failed to execute command: ${interaction.toString()}}`);
      });
    }
  },
};
