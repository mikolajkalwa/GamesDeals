import { Message, GuildChannel } from 'eris';
import fs from 'fs';
import path from 'path';
import parseArgsStringToArgv from 'string-argv';
import parseArgs from 'yargs-parser';
import bot from '../lib/bot';
import gdapi from '../lib/APIClient';
import logger from '../lib/logger';
import Time from '../helpers/Time';
import CommandDefinition from '../lib/CommandDefinition';
import { printWebhookDetails } from '../helpers/webhookHelpers';

const image = fs.readFileSync(path.resolve(__dirname, '..', '..', 'avatar.png'), 'base64');

const createWebhookCommand: CommandDefinition = {
  label: 'createwebhook',
  generator: async (msg: Message, args: string[]) => {
    try {
      if (!(msg.channel as GuildChannel).permissionsOf(bot.user.id).has('manageWebhooks')) {
        return 'In order to create a webhook I need permissions to manage webhooks in this channel!';
      }

      const existingWebhooks = await gdapi
        .getWebhooksForGuild((msg.channel as GuildChannel).guild.id);

      if (existingWebhooks.length) {
        return 'A webhook for this guild already exists!';
      }

      const webhook = await bot.createChannelWebhook(msg.channel.id, {
        name: 'Games Deals',
        avatar: `data:image/png;base64,${image}`,
      });

      const parsedArgs = parseArgs(parseArgsStringToArgv(args.join(' ')), { array: ['keywords', 'blacklist'] });

      return gdapi.saveWebhook({
        webhookId: webhook.id,
        guildId: webhook.guild_id,
        webhookToken: webhook.token,
        roleToMention: parsedArgs.mention,
        keywords: parsedArgs.keywords,
        blacklist: parsedArgs.blacklist,
      })
        .then((savedWebhook) => msg.channel.createMessage({
          content: `Webhook has been set successfully\n${printWebhookDetails(savedWebhook)}`,
          allowedMentions: {
            everyone: false,
            roles: false,
          },
        }))
        .catch((error) => `Something went wrong! Error message: ${JSON.parse(error.response.body).message}`);
    } catch (e) {
      logger.error({ e, message: `Create webhook command failed in guild: ${(msg.channel as GuildChannel).guild.id}` });
      return 'Something went wrong please try again later!';
    }
  },
  options: {
    aliases: ['cw', 'sendhere', 'sh'],
    cooldown: 2 * Time.MINUTE,
    cooldownMessage: 'This command can be used once per 2 minutes.',
    cooldownReturns: 10,
    description: 'Creates webhook. Use this if command if you want be notified about free games.',
    fullDescription: 'Bot will send notifications about free games in the channel this command was issued.',
    guildOnly: true,
    permissionMessage: 'You do not have sufficient permission to issue this command. (Required permission: manage webhooks)',
    requirements: {
      permissions: {
        manageWebhooks: true,
      },
    },
    usage: `
    Notify about all games:
    gd:createwebhook
    Mention role:
    gd:createwebhook --mention @coolPeople
    Keywords (webhook will be executed only if reddit title includes at least one of the defined keywords, you can set up to 5 keywords, if they includes spaces, wrap them in quotes):
    gd:createwebhook --keywords steam epic gog "humble bundle"
    Keywords and mention:
    gd:createwebhook --mention @coolPeople steam epic gog
    Blacklist (webhook won't be executed if reddit title includes any one of the defined words, you can set up to 5 blacklisted words, if they includes spaces, wrap them in quotes):
    gd:createwebhook --blacklist itchio indiegala
    
    Options can be combined together:
    gd:createwebhook --mention @coolPeople --keywords steam epic cyberpunk`,
  },
};

export default createWebhookCommand;
