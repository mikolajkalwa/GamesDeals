import { Message, GuildChannel } from 'eris';
import fs from 'fs';
import path from 'path';
import bot from '../lib/bot';
import gdapi from '../lib/APIClient';
import logger from '../lib/logger';
import Time from '../lib/Time';
import CommandDefinition from '../lib/CommandDefinition';

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

      if (args[0] === '@everyone' || args[0] === '@here' || /<@\d+>/.test(args[0])) {
        await gdapi.saveWebhook({
          webhookId: webhook.id,
          guildId: webhook.guild_id,
          webhookToken: webhook.token,
          roleToMention: args[0],
          keywords: args.slice(1),
        });
      } else {
        await gdapi.saveWebhook({
          webhookId: webhook.id,
          guildId: webhook.guild_id,
          webhookToken: webhook.token,
          keywords: args,
        });
      }
      return 'Webhook has been set successfully';
    } catch (e) {
      logger.error({ e, message: `Create webhook command failed in guild: ${(msg.channel as GuildChannel).guild.id}` });
      return 'Something went wrong please try again later!';
    }
  },
  options: {
    aliases: ['cw', 'sendhere', 'sh'],
    cooldown: 10 * Time.MINUTE,
    cooldownMessage: 'This command can be used once per 10 minutes.',
    cooldownReturns: 1,
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
    gd:createwebhook @roleToMention keywords separated by space (max 5 keywords)
    Notify about all games: gd:createwebhook
    Notification with a role mention: gd:createwebhook @coolPeople
    With keywords (webhook will be executed only if reddit title includes at least one of the defined keywords) gd:createwebhook steam epic gog
    Keywords and mention: gd:createwebhook @coolPeople steam epic gog`,
  },
};

export default createWebhookCommand;
