import {
  BaseGuildTextChannel, ChannelType, ChatInputCommandInteraction, DiscordAPIError, RESTJSONErrorCodes,
} from 'discord.js';
import fs from 'fs';
import path from 'path';
import gdapi from '../../../gd-api-client';
import { parseArgs, printWebhookDetails } from './command.utils';

const image = fs.readFileSync(path.resolve(__dirname, '..', '..', '..', '..', 'assets', 'avatar.png'), 'base64');

const run = async (interaction: ChatInputCommandInteraction) => {
  try {
    const targetChannel = interaction.options.getChannel('channel') as BaseGuildTextChannel;

    if (targetChannel?.type !== ChannelType.GuildText) {
      return await interaction.reply({ content: 'Choosen channel type is not supported. Currently only guild text channels are supported.', ephemeral: true });
    }

    const channelWebhooks = await targetChannel.fetchWebhooks();
    if (channelWebhooks.size === 10) {
      return await interaction.reply({ content: 'Choosen channel reached Discord webhooks limit', ephemeral: true });
    }

    const webhook = await targetChannel.createWebhook({
      name: 'Games Deals',
      avatar: `data:image/png;base64,${image}`,
    });

    const keywords = parseArgs(interaction.options.getString('keywords'));
    const blacklist = parseArgs(interaction.options.getString('ignore'));
    const role = interaction.options.getRole('role');

    const savedWebhook = await gdapi.saveWebhook({
      id: webhook.id,
      guild: webhook.guildId,
      token: webhook.token as string,
      mention: role?.id,
      channel: webhook.channelId,
      keywords: keywords || undefined,
      blacklist: blacklist || undefined,
    });

    return await interaction.reply(`Webhook created succesfully\n${printWebhookDetails(savedWebhook)}`);
  } catch (err) {
    if (err instanceof DiscordAPIError) {
      if (err.code === RESTJSONErrorCodes.MissingPermissions) {
        return await interaction.reply({ content: 'Please verify whether bot can manage webhooks in selected channel.', ephemeral: true });
      }
    }
    throw err;
  }
};

export default run;
