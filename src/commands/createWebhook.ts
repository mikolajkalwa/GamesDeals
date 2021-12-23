import path from 'path';
import fs from 'fs';
import {
  CommandInteraction, Constants, DiscordRESTError, InteractionDataOptionWithValue,
} from 'eris';
import InteractionDefinition from '../lib/InteractionDefinition';
import bot from '../lib/bot';
import gdapi from '../lib/APIClient';

import DiscordErrorCodes from '../helpers/DiscordErrorCodes';
import { printWebhookDetails } from '../helpers/webhookHelpers';
import { CreateWebhookArgs } from '../helpers/commandsTypes';

const image = fs.readFileSync(path.resolve(__dirname, '..', '..', 'avatar.png'), 'base64');

const createWebhook: InteractionDefinition = {
  name: 'createwebhook',
  description: 'Setup notifications about free games.',
  type: Constants.ApplicationCommandTypes.CHAT_INPUT,
  options: [
    {
      name: 'channel',
      description: 'Select channel',
      type: Constants.ApplicationCommandOptionTypes.CHANNEL,
      channel_types: [Constants.ChannelTypes.GUILD_TEXT],
      required: true,
    }, {
      name: 'role',
      description: 'Select role to mention whan a new deal is found',
      type: Constants.ApplicationCommandOptionTypes.ROLE,
      required: false,
    },
    {
      name: 'keywords',
      description: 'Keywords list, separated by space (for multiword wrap in double quotes)',
      type: Constants.ApplicationCommandOptionTypes.STRING,
      required: false,
    },
    {
      name: 'blacklist',
      description: 'BLacklisted keywords list, separated by space (for multiword wrap in double quotes)',
      type: Constants.ApplicationCommandOptionTypes.STRING,
      required: false,
    }],
  guildOnly: true,
  requieredPermissions: ['manageWebhooks'],

  // eslint-disable-next-line consistent-return
  generator: async (interaction: CommandInteraction): Promise<void> => {
    try {
      const args = Object.fromEntries((interaction.data.options as InteractionDataOptionWithValue[]).map((option) => [option.name, option.value])) as CreateWebhookArgs;

      const channelWebhooks = await bot.getChannelWebhooks(args.channel);
      if (channelWebhooks.length === 10) {
        return await interaction.createMessage('Choosen channel reached Discord webhooks limit');
      }

      const webhook = await bot.createChannelWebhook(args.channel, {
        name: 'Games Deals',
        avatar: `data:image/png;base64,${image}`,
      });

      const keywords = args.keywords?.match(/(?:[^\s"]+|"[^"]*")+/g) || undefined;
      const blacklist = args.blacklist?.match(/(?:[^\s"]+|"[^"]*")+/g) || undefined;

      const savedWebhook = await gdapi.saveWebhook({
        webhookId: webhook.id,
        guildId: webhook.guild_id as string,
        webhookToken: webhook.token as string,
        roleToMention: args.role ? `<@&${args.role}>` : undefined,
        keywords,
        blacklist,
      });

      await interaction.createMessage(`Webhook created succesfully\n${printWebhookDetails(savedWebhook)}`);
    } catch (err) {
      if (err instanceof DiscordRESTError) {
        if (err.code === DiscordErrorCodes.MissingPermissions) {
          return await interaction.createMessage('Please verify whether bot can manage webhooks in selected channel.');
        }
      }
      throw err;
    }
  },

};

export default createWebhook;
