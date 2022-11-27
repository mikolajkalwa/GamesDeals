import {
  ChannelType, ChatInputCommandInteraction, DiscordAPIError, RESTJSONErrorCodes,
} from 'discord.js';
import fs from 'fs';
import path from 'path';
import gdapi from '../../../gd-api-client';
import { parseArgs, printWebhookDetails } from './command.utils';

const image = fs.readFileSync(path.resolve(__dirname, '..', '..', '..', '..', 'assets', 'avatar.png'), 'base64');

const run = async (interaction: ChatInputCommandInteraction) => {
  try {
    if (!interaction.inCachedGuild()) {
      return await interaction.reply({ content: 'Guild doesn\'t exist in cache', ephemeral: true });
    }
    const targetChannel = interaction.options.getChannel('channel');

    if (!targetChannel) {
      return await interaction.reply({ content: 'No channel selected', ephemeral: true });
    }

    if (!(targetChannel.type === ChannelType.GuildText || targetChannel.type === ChannelType.GuildForum)) {
      return await interaction.reply({ content: 'Choosen channel type is not supported. Currently guild text and guild forum channels are supported.', ephemeral: true });
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
      channelType: targetChannel.type === ChannelType.GuildText ? 'GUILD_TEXT' : 'GUILD_FORUM',
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
