import type { ChatInputCommandInteraction } from 'discord.js';
import type { Logger } from 'pino';
import gdapi from '../../../../gd-api-client';
import { parseArgs, printWebhookDetails } from '../command.utils';

const setPropertiesSubCommand = async (interaction: ChatInputCommandInteraction, logger: Logger, webhookId: string) => {
  const keywords = parseArgs(interaction.options.getString('keywords'));
  const blacklist = parseArgs(interaction.options.getString('ignore'));
  const role = interaction.options.getRole('role');

  logger.info({
    keywords, blacklist, role, webhookId,
  }, 'Setting webhook properties');

  if (!blacklist && !keywords && !role) {
    logger.warn('No fields were provided to update');
    return await interaction.reply({ content: 'No fields to update', ephemeral: true });
  }

  const updatedWebhook = await gdapi.patchWebhook(webhookId, {
    keywords: keywords || undefined,
    blacklist: blacklist || undefined,
    mention: role?.id,
  });

  logger.info('Webhook updated succesfully');
  return await interaction.reply(`Webhook updated succesfully\n${printWebhookDetails(updatedWebhook)}`);
};

export default setPropertiesSubCommand;
