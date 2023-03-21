import type { ChatInputCommandInteraction } from 'discord.js';
import type { Logger } from 'pino';

import gdapi from '../../../../gd-api-client';
import { printWebhookDetails } from '../command.utils';

const clearPropertiesSubCommand = async (interaction: ChatInputCommandInteraction, logger: Logger, webhookId: string) => {
  const keywords = interaction.options.getBoolean('keywords');
  const blacklist = interaction.options.getBoolean('ignore');
  const role = interaction.options.getBoolean('role');

  logger.info({
    keywords, blacklist, role, webhookId,
  }, 'Clearing webhook properties');

  if (!blacklist && !keywords && !role) {
    logger.warn('No fields were provided to update');
    return await interaction.reply({ content: 'No fields to update', ephemeral: true });
  }

  const updatedWebhook = await gdapi.patchWebhook(webhookId, {
    keywords: keywords ? [] : undefined,
    blacklist: blacklist ? [] : undefined,
    mention: role ? null : undefined,
  });
  logger.info('Webhook updated succesfully');
  return await interaction.reply(`Webhook updated succesfully\n${printWebhookDetails(updatedWebhook)}`);
};

export default clearPropertiesSubCommand;
