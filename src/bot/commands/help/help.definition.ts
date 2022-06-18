import { SlashCommandBuilder } from '@discordjs/builders';

const helpDefinition = new SlashCommandBuilder()
  .setName('help')
  .setDescription('How to use the bot.');

export default helpDefinition;
