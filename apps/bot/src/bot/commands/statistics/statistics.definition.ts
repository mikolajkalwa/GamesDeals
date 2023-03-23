import { SlashCommandBuilder } from 'discord.js';

const statisticsDefinition = new SlashCommandBuilder()
  .setName('statistics')
  .setDescription('Bot statistics.');

export default statisticsDefinition;
