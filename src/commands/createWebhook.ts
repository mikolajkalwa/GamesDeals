import {
  CommandInteraction, Constants, DiscordRESTError, TextableChannel,
} from 'eris';
import fs from 'fs';
import path from 'path';
import InteractionDefinition from '../lib/InteractionDefinition';
import bot from '../lib/bot';
import DiscordErrorCodes from '../helpers/DiscordErrorCodes';

const image = fs.readFileSync(path.resolve(__dirname, '..', '..', 'avatar.png'), 'base64');

const createWebhook: InteractionDefinition = {
  name: 'cw',
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
      const { id } = interaction.data.resolved?.channels?.values().next().value as TextableChannel;

      if (!id) {
        return await interaction.createMessage('Selected channel not found.');
      }

      const channelWebhooks = await bot.getChannelWebhooks(id);
      if (channelWebhooks.length === 10) {
        return await interaction.createMessage('Choosen channel riched Discord webhooks limit');
      }

      await bot.createChannelWebhook(id, {
        name: 'Games Deals',
        avatar: `data:image/png;base64,${image}`,
      });

      await interaction.createMessage('Webhook created succesfully');
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
