import { Message, GuildChannel } from 'eris';
import gdapi, { ReadWebhook } from '../lib/APIClient';
import CommandDefinition from '../lib/CommandDefinition';

const createContent = (webhook: ReadWebhook): string => `Webhook ID: ${webhook.webhookId}\n`
  + `Created at: ${webhook.createdAt}\n`
  + `Updated at: ${webhook.updatedAt}\n`
  + `Keywords: ${webhook.keywords?.length ? `${webhook.keywords}` : 'There are no keywords defined for this webhook.'}\n`
  + `Role to mention: ${Object.prototype.hasOwnProperty.call(webhook, 'roleToMention') ? `${webhook.roleToMention}` : 'Role to mention is not defined for this webhook.'}\n\n`;

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
        messageChunksToSend.push(createContent(webhook));
      } else {
        msg.channel.createMessage('Provided webhook doesn\'t exists / is not related to this guild.');
        return;
      }
    } else {
      webhooks.forEach((webhook) => {
        const nextWebhook = createContent(webhook);
        if (content.length + nextWebhook.length <= 2000) {
          content += createContent(webhook);
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
