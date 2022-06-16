import { SlashCommandBuilder } from '@discordjs/builders';

const statisticsDefinition = new SlashCommandBuilder()
  .setName('statistics')
  .setDescription('Bot statistics.');

export default statisticsDefinition;
