import type { ChatInputCommandInteraction } from 'discord.js';
import gdapi from '../../../../gd-api-client';
import { parseArgs, printWebhookDetails } from '../command.utils';

const setPropertiesSubCommand = async (interaction: ChatInputCommandInteraction, webhookId: string) => {
  const keywords = parseArgs(interaction.options.getString('keywords'));
  const blacklist = parseArgs(interaction.options.getString('ignore'));
  const role = interaction.options.getRole('role');

  if (!blacklist && !keywords && !role) {
    return await interaction.reply({ content: 'No fields to update', ephemeral: true });
  }

  const updatedWebhook = await gdapi.patchWebhook(webhookId, {
    keywords: keywords || undefined,
    blacklist: blacklist || undefined,
    mention: role?.id,
  });
  return await interaction.reply(`Webhook updated succesfully\n${printWebhookDetails(updatedWebhook)}`);
};

export default setPropertiesSubCommand;
