import { CommandInteraction } from 'discord.js';
import CommandHandler from '../command-handler.type';

const ping: CommandHandler = {
  generator: async (interaction: CommandInteraction) => await interaction.reply({
    content: '**Pong!** :ping_pong:',
    ephemeral: true,
  }),
};

export default ping;
