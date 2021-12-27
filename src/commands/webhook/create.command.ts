import path from 'path';
import fs from 'fs';
import { CommandInteraction, DiscordRESTError } from 'eris';
import DiscordErrorCodes from '../../helpers/DiscordErrorCodes';
import { CreateWebhookArgs } from './arguments.types';
import bot from '../../lib/bot';
import gdapi from '../../lib/APIClient';
import { printWebhookDetails } from '../../helpers/webhookHelpers';

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
};

export default run;
