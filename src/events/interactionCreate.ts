import { CommandInteraction, Interaction } from 'eris';
import commands from '../commands';

import logger from '../lib/logger';

export default {
  event: 'interactionCreate',
  generator: (interaction: Interaction) => {
    if (interaction instanceof CommandInteraction) {
      logger.info(interaction, 'Executing interaction');
      const command = commands.get(interaction.data.name);
      if (!command) {
        logger.warn(`Command was not found ${interaction.data.name}`);
      } else {
        command.generator(interaction as CommandInteraction).catch((e) => {
          logger.error(e, `Failed to execute interaction: ${interaction.toString()}}`);
        });
      }
    }
  },
};
