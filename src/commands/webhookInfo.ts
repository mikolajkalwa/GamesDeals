import { Message, GuildChannel } from 'eris';
import gdapi from '../lib/APIClient';
import CommandDefinition from '../lib/CommandDefinition';
import { printWebhookDetails } from '../helpers/webhookHelpers';

const webhookInfoCommand: CommandDefinition = {
  label: 'webhookinfo',
  generator: async (msg: Message, args: string[]) => {
    let content = '**Webhook details:**\n';
    const messageChunksToSend: string[] = [];

    const webhooks = await gdapi.getWebhooksForGuild((msg.channel as GuildChannel).guild.id);

    const webhookID = args[0];
    if (webhookID) {
      const webhook = webhooks.filter((w) => w.webhookId === webhookID)[0];
      if (webhook) {
        messageChunksToSend.push(printWebhookDetails(webhook));
      } else {
        msg.channel.createMessage('Provided webhook doesn\'t exists / is not related to this guild.');
        return;
      }
    } else {
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
    }

    await Promise.all(messageChunksToSend.map(async (chunk) => msg.channel
      .createMessage({
        content: chunk,
        allowedMentions: {
          everyone: false,
          roles: false,
        },
      })));
  },
  options: {
    description: 'Information about webhooks created by the bot.',
    guildOnly: true,
    aliases: ['wi'],
  },
};

export default webhookInfoCommand;
