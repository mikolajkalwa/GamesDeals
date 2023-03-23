import { SlashCommandBuilder } from 'discord.js';

const latestDefinition = new SlashCommandBuilder()
  .setName('latest')
  .setDescription('Information about latest found game.');

export default latestDefinition;
