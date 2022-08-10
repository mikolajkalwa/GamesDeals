import { ChatInputCommandInteraction } from 'discord.js';
import gdapi from '../../../../gd-api-client';
import { parseArgs, printWebhookDetails } from '../command.utils';

const setPropertiesSubCommand = async (interaction: ChatInputCommandInteraction, webhookId: string) => {
  const keywords = parseArgs(interaction.options.getString('keywords'));
  const blacklist = parseArgs(interaction.options.getString('ignore'));
  const role = interaction.options.getRole('role');

  const updatedWebhook = await gdapi.patchWebhook(webhookId, {
    keywords: keywords || undefined,
    blacklist: blacklist || undefined,
    mention: role?.id,
  });
  await interaction.reply(`Webhook updated succesfully\n${printWebhookDetails(updatedWebhook)}`);
};

export default setPropertiesSubCommand;
