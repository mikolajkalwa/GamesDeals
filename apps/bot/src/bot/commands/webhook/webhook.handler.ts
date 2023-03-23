import { ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import type { Logger } from 'pino';
import type CommandHandler from '../command-handler.type';
import createWebhook from './create.command';
import deleteWebhook from './delete.command';
import editWebhook from './edit.command';
import describeWebhooks from './get.command';

type SubcommandFunction = (interaction: ChatInputCommandInteraction, logger: Logger) => Promise<unknown>;

const subcommands = new Map<string, SubcommandFunction>([
  ['create', createWebhook],
  ['delete', deleteWebhook],
  ['info', describeWebhooks],
  ['set', editWebhook],
  ['clear', editWebhook],
]);

const webhookHandler: CommandHandler = {
  guildOnly: true,
  requieredPermissions: [PermissionFlagsBits.ManageWebhooks],

  generator: async (interaction: ChatInputCommandInteraction, logger: Logger): Promise<unknown> => {
    const subcommand = interaction.options.getSubcommand();
    logger.info({ interaction, subcommand }, 'Executing command: webhook');
    const strategy = subcommands.get(subcommand);

    if (!strategy) {
      logger.warn(`Unknown subcommand: ${subcommand}`);
      return await interaction.reply({ content: 'Unknown subcommand', ephemeral: true });
    }
    return await strategy(interaction, logger);
  },
};

export default webhookHandler;
