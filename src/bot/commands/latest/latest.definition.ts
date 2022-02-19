import { SlashCommandBuilder } from '@discordjs/builders';

const latestDefinition = new SlashCommandBuilder()
  .setName('latest')
  .setDescription('Information about latest found game.');

export default latestDefinition;
