import { SlashCommandBuilder } from 'discord.js';

const pingDefinition = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Ping the bot to see if there are latency issues.');

export default pingDefinition;
