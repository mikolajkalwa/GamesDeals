import { Message, GuildChannel } from 'eris';
import gdapi from '../lib/APIClient';
import Time from '../helpers/Time';
import bot from '../lib/bot';
import CommandDefinition from '../lib/CommandDefinition';
import logger from '../lib/logger';

const removeWebhook: CommandDefinition = {
  label: 'removewebhook',
  generator: async (msg: Message, args: string[]) => {
    if (args.length < 1) {
      return 'Not enough parameters';
    }

    const webhooks = await gdapi.getWebhooksForGuild((msg.channel as GuildChannel).guild.id);
    const webhookID = args[0];
    const webhook = webhooks.filter((w) => w.webhookId === webhookID)[0];
    if (webhook) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = await Promise.allSettled([
        bot.deleteWebhook(webhook.webhookId, webhook.webhookToken),
        gdapi.deleteWebhook(webhook.webhookId),
      ]);
      if (result[0].status === 'rejected' && result[1].status === 'rejected') {
        logger.error({ err: result[0].reason, message: `Failed to delete webhook from disccord: ${webhook.webhookId}` });
        logger.error({ err: result[1].reason, message: `Failed to delete webhook from database: ${webhook.webhookId}` });
        return 'Something went wrong!';
      }
      return 'Bot won\'t send any messages to this channel anymore.';
    }
    return 'Provided webhook doesn\'t exists / is not related to this guild.';
  },
  options: {
    aliases: ['rw'],
    cooldown: 2 * Time.MINUTE,
    cooldownMessage: 'This command can be used once per 10 minutes.',
    cooldownReturns: 10,
    description: 'Removes webhook with provided ID',
    guildOnly: true,
    permissionMessage: 'You do not have sufficient permission to issue this command. (Required permission: manage webhooks)',
    requirements: {
      permissions: {
        manageWebhooks: true,
      },
    },
    usage: `
    gd:removewebhook webhookID 
    WebhookID is an unique identifier for a webhook. Webhook id can be found in 2 easy ways:
    • command: gd:webhookinfo will list all webhooks created by gamesdeals
    • open channel settings, go to webhooks tabs, and copy webhook url. The url has following structure:
      \`https://discord.com/api/webhooks/webhookId/webhookToken\`
    `,
  },
};

export default removeWebhook;
