import { CommandInteraction } from 'eris';
import { DeleteWebhookArgs } from './arguments.types';
import bot from '../../helpers/bot';
import gdapi from '../../helpers/APIClient';
import logger from '../../helpers/logger';

// eslint-disable-next-line consistent-return
const run = async (interaction: CommandInteraction, options: DeleteWebhookArgs) => {
  const webhooks = await gdapi.getWebhooksForGuild((interaction.guildID as string));
  const [webhook] = webhooks.filter((x) => x.id === options.webhook);

  if (!webhook) {
    return interaction.createMessage('Webhook with provided ID doesn\'t exist.');
  }

  const result = await Promise.allSettled([
    bot.deleteWebhook(webhook.id, webhook.token),
    gdapi.deleteWebhook(webhook.id),
  ]);

  if (result.every((x) => x.status === 'rejected')) {
    logger.error(result, 'Unable to delete webhook from database and discord');
    return interaction.createMessage('Something went wrong, please try again later');
  }

  await interaction.createMessage('Webhook has been deleted');
};

export default run;
