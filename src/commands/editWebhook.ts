import { Message, GuildChannel } from 'eris';
import gdapi, { ReadWebhook } from '../lib/APIClient';
import logger from '../lib/logger';
import CommandDefinition from '../lib/CommandDefinition';
import Time from '../lib/Time';

const setMention = (webhookId: string, roleToMention: string | null) => gdapi
  .patchWebhook(webhookId, { roleToMention });
const editKeywords = (webhookID: string, keywords: string[] | null) => gdapi
  .patchWebhook(webhookID, { keywords });
const addKeywords = (webhook: ReadWebhook, keywords: string[]) => {
  if (webhook.keywords?.length) {
    const newKeywords = webhook.keywords.concat(keywords);
    return gdapi.patchWebhook(webhook.webhookId, { keywords: newKeywords });
  }
  return editKeywords(webhook.webhookId, keywords);
};

const editWebhookCommand: CommandDefinition = {
  label: 'editwebhook',
  generator: async (msg: Message, args: string[]) => {
    if (args.length < 2) {
      return 'Not enough parameters';
    }

    const webhooks = await gdapi.getWebhooksForGuild((msg.channel as GuildChannel).guild.id);
    const webhookID = args[0];
    const filteredWebhooks = webhooks.filter((webhook) => webhook.webhookId === webhookID);
    if (filteredWebhooks.length === 1) {
      switch (args[1]) {
        case 'setmention':
        case 'sm':
          if (args.length !== 3) {
            return 'Not enough parameters';
          }
          return setMention(webhookID, args[2])
            .then(() => 'Role to mention set successfully!')
            .catch((e) => {
              logger.error({ e, message: `Unable to set mention for webhook ${webhookID}, ${args}` });
              return `Something went wrong! Error message: ${JSON.parse(e.response.body).message}`;
            });

        case 'removemention':
        case 'rm':
          return setMention(webhookID, null)
            .then(() => 'Role to mention removed successfully!')
            .catch((e) => {
              logger.error({ e, message: `Unable to remove mention for webhook ${webhookID}` });
              return `Something went wrong! Error message: ${JSON.parse(e.response.body).message}`;
            });

        case 'editkeywords':
        case 'ek':
          if (args.length < 3) {
            return 'Not enough parameters';
          }
          return editKeywords(webhookID, args.slice(2))
            .then(() => 'Keywords set successfully!')
            .catch((e) => {
              logger.error({ e, message: `Unable to edit keywords for webhook ${webhookID}, ${args}` });
              return `Something went wrong! Error message: ${JSON.parse(e.response.body).message}`;
            });

        case 'removekeywords':
        case 'rk':
          return editKeywords(webhookID, null)
            .then(() => 'Keywords removed successfully!')
            .catch((e) => {
              logger.error({ e, message: `Unable to remove keywords for webhook ${webhookID}` });
              return `Something went wrong! Error message: ${JSON.parse(e.response.body).message}`;
            });

        case 'addkeywords':
        case 'ak':
          if (args.length < 3) {
            return 'Not enough parameters';
          }
          return addKeywords(filteredWebhooks[0], args.slice(2))
            .then(() => 'Keywords added successfully!')
            .catch((e) => {
              logger.error({ e, message: `Unable to add keywords for webhook ${webhookID}, ${args}` });
              return `Something went wrong! Error message: ${JSON.parse(e.response.body).message}`;
            });

        default:
          return `Unknown parameter ${args[1]}`;
      }
    } else {
      return 'Provided webhook doesn\'t exists / is not related to this guild.';
    }
  },
  options: {
    aliases: ['ew'],
    argsRequired: true,
    cooldown: 2 * Time.MINUTE,
    cooldownMessage: 'This command can be used once per 2 minutes.',
    cooldownReturns: 10,
    description: 'Edits webhook parameters like role to mention or keywords.',
    guildOnly: true,
    permissionMessage: 'You do not have sufficient permission to issue this command. (Required permission: manage webhooks)',
    requirements: {
      permissions: {
        manageWebhooks: true,
      },
    },
    usage: `
    Set / update role to mention:
    gd:editwebhook webhookID setmention @coolPeople 
    (shorthand: gd:ew webhookID sm @evenCoolerPeople)
    Clear role to mention:
    gd:editwebhook webhookID removemention
    (shorthand: gd:ew webhookID rm)
    Edit keywords (overrides current ones):
    gd:editwebhook webhookID editkeywords cyberpunk steam gog
    (shorthand: gd:ew webhookID ek cyberpunk steam gog)
    Clear keywords:
    gd:editwebhook webhookID removekeywords
    (shorthand: gd:ew webhookID rk)
    Add new keywords to existing ones:
    gd:editwebhook webhookID addkeywords witcher cdpr
    (shorthand: gd:ew webhookID ak witcher cdpr)

    Okey, why is this that complicated? Why do I need to pass webhookID? And what the hell is webhook id?
    WebhookID is an unique identifier for a webhook. Webhook id can be found in 2 easy ways:
    • command: gd:webhookinfo will list all webhooks created by gamesdeals bot
    • open channel settings, go to webhooks tabs, and copy webhook url. The url has following structure:
      \`https://discord.com/api/webhooks/webhookId/webhookToken\`
    `,
  },
};

export default editWebhookCommand;
