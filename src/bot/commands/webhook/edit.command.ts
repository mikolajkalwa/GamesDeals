import type { ChatInputCommandInteraction } from 'discord.js';
import type { Logger } from 'pino';

import gdapi from '../../../gd-api-client';
import clearPropertiesSubCommand from './edit/clear-properties.subcommand';
import setPropertiesSubCommand from './edit/set-properties.subcommand';

type SubcommandFunction = (interaction: ChatInputCommandInteraction, webhook: string) => Promise<unknown>;

const subcommands = new Map<string, SubcommandFunction>([
  ['clear', clearPropertiesSubCommand],
  ['set', setPropertiesSubCommand],
]);

const run = async (interaction: ChatInputCommandInteraction, logger: Logger) => {
  const targetWebhook = interaction.options.getString('webhook', true);
  const subcommand = interaction.options.getSubcommand();

  const webhooks = await gdapi.getWebhooksForGuild((interaction.guildId as string));
  const [webhook] = webhooks.filter((x) => x.id === targetWebhook);

  if (!webhook) {
    return await interaction.reply({ content: 'Webhook with provided ID doesn\'t exist.', ephemeral: true });
  }

  const strategy = subcommands.get(subcommand);
  if (!strategy) {
    logger.warn(`Unknown subcommand: ${subcommand}`);
    return await interaction.reply({ content: 'Unknown subcommand', ephemeral: true });
  }

  return await strategy(interaction, targetWebhook);
};

export default run;
