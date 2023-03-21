import {
  ChannelType, ChatInputCommandInteraction, DiscordAPIError, RESTJSONErrorCodes,
} from 'discord.js';
import fs from 'fs';
import path from 'path';
import type { Logger } from 'pino';
import gdapi from '../../../gd-api-client';
import { parseArgs, printWebhookDetails } from './command.utils';

const image = fs.readFileSync(path.resolve(__dirname, '..', '..', '..', '..', 'assets', 'avatar.png'), 'base64');

const run = async (interaction: ChatInputCommandInteraction, logger: Logger) => {
  try {
    logger.info(interaction, 'Creating new webhook');
    if (!interaction.inCachedGuild()) {
      logger.warn('Guild doesn\'t exist in cache');
      return await interaction.reply({ content: 'Guild doesn\'t exist in cache', ephemeral: true });
    }
    const targetChannel = interaction.options.getChannel('channel');

    if (!targetChannel) {
      logger.warn('No channel selected for webhook creation');
      return await interaction.reply({ content: 'No channel selected', ephemeral: true });
    }

    if (!(targetChannel.type === ChannelType.GuildText || targetChannel.type === ChannelType.GuildForum)) {
      logger.warn(targetChannel, 'User attempted to create webhook in not supported channel type');
      return await interaction.reply({ content: 'Choosen channel type is not supported. Currently guild text and guild forum channels are supported.', ephemeral: true });
    }
    await interaction.deferReply({ ephemeral: true });

    const channelWebhooks = await targetChannel.fetchWebhooks();
    if (channelWebhooks.size === 10) {
      logger.info('Channel reached maximum amount of webhooks');
      return await interaction.editReply({ content: 'Choosen channel reached Discord webhooks limit' });
    }

    const webhook = await targetChannel.createWebhook({
      name: 'Games Deals',
      avatar: `data:image/png;base64,${image}`,
    });

    logger.info('Webhook created in Discord');

    const keywords = parseArgs(interaction.options.getString('keywords'));
    const blacklist = parseArgs(interaction.options.getString('ignore'));
    const role = interaction.options.getRole('role');

    logger.info({ keywords, blacklist, role }, 'Creating webhook in games-deals API');

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

    logger.info({ keywords, blacklist, role }, 'Webhook created in games-deals API');
    return await interaction.editReply({ content: `Webhook created succesfully\n${printWebhookDetails(savedWebhook)}` });
  } catch (err) {
    if (err instanceof DiscordAPIError) {
      if (err.code === RESTJSONErrorCodes.MissingPermissions) {
        logger.warn('Bot has no sufficient permissions to create webhook');
        return await interaction.editReply({ content: 'Please verify whether bot can manage webhooks in selected channel.' });
      }
    }
    logger.error(err, 'Error occured in create webhook command');
    throw err;
  }
};

export default run;
