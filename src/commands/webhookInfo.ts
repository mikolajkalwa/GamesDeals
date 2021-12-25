import {
  CommandInteraction, Constants,
} from 'eris';
import InteractionDefinition from '../lib/InteractionDefinition';
import gdapi from '../lib/APIClient';
import { printWebhookDetails } from '../helpers/webhookHelpers';

const webhookInfo: InteractionDefinition = {
  name: 'webhookinfo',
  description: 'Details about configured webhooks',
  type: Constants.ApplicationCommandTypes.CHAT_INPUT,
  guildOnly: true,
  requieredPermissions: ['manageWebhooks'],

  // eslint-disable-next-line consistent-return
  generator: async (interaction: CommandInteraction): Promise<void> => {
    let content = '**Webhook details:**\n';
    const messageChunksToSend: string[] = [];
    const webhooks = await gdapi.getWebhooksForGuild((interaction.guildID as string));
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
  },

};

export default webhookInfo;
