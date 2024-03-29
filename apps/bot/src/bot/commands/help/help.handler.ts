import type { CommandInteraction } from 'discord.js';
import type { Logger } from 'pino';
import type CommandHandler from '../command-handler.type';

const help: CommandHandler = {
  generator: async (interaction: CommandInteraction, logger: Logger) => {
    logger.info(interaction, 'Executing command: help');
    return await interaction.reply({
      content: 'Instruction how to setup the bot: https://github.com/mikolajkalwa/GamesDealsBot/blob/master/readme.md \nFor additional help join support server: https://discord.gg/ZkjqCmM',
      ephemeral: true,
    });
  },
};

export default help;
