import { ChatInputCommandInteraction } from 'discord.js';

import gdapi from '../../../../gd-api-client';
import { printWebhookDetails } from '../command.utils';

const clearPropertiesSubCommand = async (interaction: ChatInputCommandInteraction, webhookId: string) => {
  const keywords = interaction.options.getBoolean('keywords');
  const blacklist = interaction.options.getBoolean('ignore');
  const role = interaction.options.getBoolean('role');

  if (!blacklist && !keywords && !role) {
    return await interaction.reply({ content: 'No fields to update', ephemeral: true });
  }

  const updatedWebhook = await gdapi.patchWebhook(webhookId, {
    keywords: keywords ? null : undefined,
    blacklist: blacklist ? null : undefined,
    mention: role ? null : undefined,
  });
  return await interaction.reply(`Webhook updated succesfully\n${printWebhookDetails(updatedWebhook)}`);
};

export default clearPropertiesSubCommand;
