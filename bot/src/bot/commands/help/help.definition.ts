import { SlashCommandBuilder } from 'discord.js';

const helpDefinition = new SlashCommandBuilder()
  .setName('help')
  .setDescription('How to use the bot.');

export default helpDefinition;
