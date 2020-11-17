import { Message, GuildChannel } from 'eris';
import parseArgsStringToArgv from 'string-argv';
import parseArgs from 'yargs-parser';
import gdapi from '../lib/APIClient';
import logger from '../lib/logger';
import CommandDefinition from '../lib/CommandDefinition';
import Time from '../helpers/Time';
import { printWebhookDetails } from '../helpers/webhookHelpers';

const editWebhookCommand: CommandDefinition = {
  label: 'editwebhook',
  generator: async (msg: Message, args: string[]) => {
    const parsedArgs = parseArgs(parseArgsStringToArgv(args.join(' ')), {
      alias: {
        webhook: ['id'],
        removekeywords: ['rk'],
        removeblacklist: ['rb'],
        removemention: ['rm'],
        mention: ['setmention', 'sm'],
        keywords: ['editkeywords', 'ek'],
      },
      string: ['webhook'],
      array: ['keywords', 'blacklist'],
    });

    if (!Object.prototype.hasOwnProperty.call(parsedArgs, 'webhook')) {
      return 'Please provide an identifier of webhook';
    }

    const webhooks = await gdapi.getWebhooksForGuild((msg.channel as GuildChannel).guild.id);
    const webhookID = parsedArgs.webhook;
    const filteredWebhooks = webhooks.filter((webhook) => webhook.webhookId === webhookID);
    if (filteredWebhooks.length === 1) {
      const patch = {
        keywords: parsedArgs.keywords,
        blacklist: parsedArgs.blacklist,
        roleToMention: parsedArgs.mention,
      };

      if (Object.prototype.hasOwnProperty.call(parsedArgs, 'removekeywords')) {
        patch.keywords = null;
      }
      if (Object.prototype.hasOwnProperty.call(parsedArgs, 'removeblacklist')) {
        patch.blacklist = null;
      }
      if (Object.prototype.hasOwnProperty.call(parsedArgs, 'removemention')) {
        patch.roleToMention = null;
      }

      return gdapi.patchWebhook(webhookID, patch)
        .then((updatedWebhook) => `**Webhook updated successfully**\n${printWebhookDetails(updatedWebhook)}`)
        .catch((e) => {
          logger.error({ e, message: `Unable to set mention for webhook ${webhookID}, ${args}` });
          return `Something went wrong! Error message: ${JSON.parse(e.response.body).message}`;
        });
    }
    return 'Provided webhook doesn\'t exists / is not related to this guild.';
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
    **Set role to mention:**
    gd:editwebhook --webhook <webhookID> --mention <role> @coolPeople
    Example: gd:editwebhook --webhook 1234567890 --mention @coolPeople
    **Clear role to mention:**
    gd:editwebhook --webhook <webhookID> --removemention
    Example: gd:editwebhook --webhook 1234567890 --removemention
    **Edit keywords (overrides current ones):**
    gd:editwebhook --webhook <webhookID> --keywords <keywords to set (up to 5, if includes spaces, wrap it in quotes)>
    Example: gd:editwebhook --webhook 1234567890 --keywords cyberpunk steam gog "humble bundle" "euro truck simulator 2"
    **Clear keywords:**
    gd:editwebhook --webhook <webhookID> --removekeywords
    Example: gd:editwebhook --webhook 1234567890 --removekeywords
    **Edit blacklist:**
    gd:editwebhook --webhook <webhookID> --blacklist <words to block (up to 5, if includes spaces, wrap it in quotes)>
    Example: gd:editwebhook --webhook 1234567890 --blacklist itchio indiegala "euro truck simulator 2"
    **Clear blacklist:**
    gd:editwebhook --webhook <webhookID> --removeblacklist
    Example: gd:editwebhook --webhook 1234567890 --removeblacklist

    **How to find webhookID:**
    WebhookID is an unique identifier for a webhook. Webhook id can be found in 2 ways:
    • command: gd:webhookinfo will list all webhooks created by gamesdeals bot
    • open channel settings => integrations => webhooks, and copy webhook url. The url has following structure:
      discord.com/api/webhooks/**webhookID**/webhookToken (**DO NOT SHARE WEBHOOK TOKEN!**)\`
    `,
  },
};

export default editWebhookCommand;
