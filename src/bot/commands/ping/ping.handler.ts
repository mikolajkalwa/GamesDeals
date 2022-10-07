import type { CommandInteraction } from 'discord.js';
import type CommandHandler from '../command-handler.type';

const ping: CommandHandler = {
  generator: async (interaction: CommandInteraction) => await interaction.reply({
    content: '**Pong!** :ping_pong:',
    ephemeral: true,
  }),
};

export default ping;
