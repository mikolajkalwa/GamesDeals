import { CommandInteraction } from 'eris';
import gdapi from '../../helpers/APIClient';
import { printWebhookDetails } from './webhook.utils';

// eslint-disable-next-line consistent-return
const run = async (interaction: CommandInteraction) => {
  let content = '';
  const messageChunksToSend: string[] = [];
  const webhooks = await gdapi.getWebhooksForGuild((interaction.guildID as string));

  if (!webhooks.length) {
    return interaction.createMessage('There are no webhooks configured for this guild.');
  }

  webhooks.forEach((webhook) => {
    const nextWebhook = printWebhookDetails(webhook);
    if (content.length + nextWebhook.length <= 2000) {
      content += printWebhookDetails(webhook);
    } else {
      messageChunksToSend.push(content);
      content = nextWebhook;
    }
  });
  messageChunksToSend.push(content);

  await interaction.defer();
  await Promise.all(messageChunksToSend.map(async (chunk) => interaction
    .createFollowup({
      content: chunk,
      allowedMentions: {
        everyone: false,
        roles: false,
      },
    })));
};

export default run;
