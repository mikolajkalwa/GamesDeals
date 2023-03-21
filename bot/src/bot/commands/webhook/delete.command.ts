import { ChatInputCommandInteraction, WebhookClient } from 'discord.js';
import type { Logger } from 'pino';
import gdapi from '../../../gd-api-client';

const run = async (interaction: ChatInputCommandInteraction, logger: Logger) => {
  const targetWebhook = interaction.options.getString('webhook', true);

  logger.info({ targetWebhook }, 'Trying to delete webhook');
  const webhooks = await gdapi.getWebhooksForGuild((interaction.guildId as string));
  const [webhook] = webhooks.filter((x) => x.id === targetWebhook);

  if (!webhook) {
    logger.warn('Webhook not found');
    return await interaction.reply({ content: 'Webhook with provided ID doesn\'t exist.', ephemeral: true });
  }

  const result = await Promise.allSettled([
    new WebhookClient({ id: webhook.id, token: webhook.token }).delete(),
    gdapi.deleteWebhook(webhook.id),
  ]);

  if (result.every((x) => x.status === 'rejected')) {
    logger.error(result, 'Unable to delete webhook from database and discord');
    return await interaction.reply({ content: 'Something went wrong, please try again later', ephemeral: true });
  }

  logger.warn('Webhook deleted');
  return await interaction.reply('Webhook has been deleted');
};

export default run;
