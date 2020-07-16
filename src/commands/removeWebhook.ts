import {
  CommandGenerator, CommandOptions, Message, GuildChannel,
} from 'eris';
import gdapi from '../lib/APIClient';
import logger from '../lib/logger';
import Time from '../lib/Time';
import bot from '../lib/bot';

const removeWebhook: { label: string, generator: CommandGenerator, options?: CommandOptions } = {
  label: 'removewebhook',
  generator: async (msg: Message, args: string[]) => {
    if (args.length < 1) {
      return 'Not enough parameters';
    }

    const webhooks = await gdapi.getWebhooksForGuild((msg.channel as GuildChannel).guild.id);
    const webhookID = args[0];
    const webhook = webhooks.filter((w) => w.webhookId === webhookID)[0];
    if (webhook) {
      try {
        await gdapi.deleteWebhook(webhook.webhookId);
        await bot.deleteWebhook(webhook.webhookId, webhook.webhookToken);
        return 'Webhook removed succesfully';
      } catch (e) {
        logger.error({ e, message: `Unable to delete webhook ${webhook}` });
        return 'Something went wrong!';
      }
    }
    return 'Provided webhook doesn\'t exists / is not related to this guild.';
  },
  options: {
    aliases: ['rw'],
    cooldown: 10 * Time.MINUTE,
    cooldownMessage: 'This command can be used once per 10 minutes.',
    cooldownReturns: 1,
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
      \`https://discordapp.com/api/webhooks/webhookId/webhookToken\`
    `,
  },
};

export default removeWebhook;
