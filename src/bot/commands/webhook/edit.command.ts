import { CommandInteraction } from 'discord.js';
import { Logger } from 'pino';

import gdapi from '../../../gd-api-client';
import { printWebhookDetails, parseArgs } from './command.utils';

// eslint-disable-next-line consistent-return
const clearPropertiesSubCommand = async (interaction: CommandInteraction, webhookId: string) => {
  const keywords = interaction.options.getBoolean('keywords');
  const blacklist = interaction.options.getBoolean('blacklist');
  const role = interaction.options.getBoolean('role');

  if (!blacklist && !keywords && !role) {
    return interaction.reply({ content: 'No fields to update', ephemeral: true });
  }

  const updatedWebhook = await gdapi.patchWebhook(webhookId, {
    keywords: keywords ? null : undefined,
    blacklist: blacklist ? null : undefined,
    role: role ? null : undefined,
  });
  await interaction.reply(`Webhook updated succesfully\n${printWebhookDetails(updatedWebhook)}`);
};

const setPropertiesSubCommand = async (interaction: CommandInteraction, webhookId: string) => {
  const keywords = parseArgs(interaction.options.getString('keywords'));
  const blacklist = parseArgs(interaction.options.getString('blacklist'));
  const role = interaction.options.getRole('role');

  const updatedWebhook = await gdapi.patchWebhook(webhookId, {
    keywords,
    blacklist,
    role: role?.id,
  });
  await interaction.reply(`Webhook updated succesfully\n${printWebhookDetails(updatedWebhook)}`);
};

// eslint-disable-next-line consistent-return
const run = async (interaction: CommandInteraction, logger: Logger) => {
  const targetWebhook = interaction.options.getString('webhook', true);
  const subcommandGroup = interaction.options.getSubcommandGroup();

  const webhooks = await gdapi.getWebhooksForGuild((interaction.guildId as string));
  const [webhook] = webhooks.filter((x) => x.id === targetWebhook);

  if (!webhook) {
    return interaction.reply({ content: 'Webhook with provided ID doesn\'t exist.', ephemeral: true });
  }

  switch (subcommandGroup) {
    case 'clear': {
      await clearPropertiesSubCommand(interaction, targetWebhook);
      break;
    }
    case 'set': {
      await setPropertiesSubCommand(interaction, targetWebhook);
      break;
    }
    default: {
      await interaction.reply({ content: 'Unknown subcommand', ephemeral: true });
      logger.warn(`Unknown subcommand group: ${subcommandGroup}`);
    }
  }
};

export default run;
