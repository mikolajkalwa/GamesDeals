import path from 'path';
import fs from 'fs';
import { CommandInteraction, DiscordRESTError } from 'eris';
import DiscordErrorCodes from '../../types/discord-error-codes.enum';
import { CreateWebhookArgs } from './arguments.types';
import bot from '../../helpers/bot';
import gdapi from '../../helpers/APIClient';
import { printWebhookDetails } from './webhook.utils';
import { parseArgs } from '../commands.utils';

const image = fs.readFileSync(path.resolve(__dirname, '..', '..', '..', 'assets', 'avatar.png'), 'base64');

// eslint-disable-next-line consistent-return
const run = async (interaction: CommandInteraction, args: CreateWebhookArgs) => {
  try {
    const channelWebhooks = await bot.getChannelWebhooks(args.channel);
    if (channelWebhooks.length === 10) {
      return await interaction.createMessage('Choosen channel reached Discord webhooks limit');
    }

    const webhook = await bot.createChannelWebhook(args.channel, {
      name: 'Games Deals',
      avatar: `data:image/png;base64,${image}`,
    });

    const keywords = args.keywords ? parseArgs(args.keywords) : undefined;
    const blacklist = args.blacklist ? parseArgs(args.blacklist) : undefined;

    const savedWebhook = await gdapi.saveWebhook({
      id: webhook.id,
      guild: webhook.guild_id as string,
      token: webhook.token as string,
      role: args.role ? args.role : undefined,
      channel: webhook.channel_id as string,
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
};

export default run;
