import type { CommandInteraction } from 'discord.js';
import type { Logger } from 'pino';
import type CommandHandler from '../command-handler.type';

const ping: CommandHandler = {
  generator: async (interaction: CommandInteraction, logger: Logger) => {
    logger.info(interaction, 'Executing command: ping');
    return await interaction.reply({
      content: '**Pong!** :ping_pong:',
      ephemeral: true,
    });
  },
};

export default ping;
