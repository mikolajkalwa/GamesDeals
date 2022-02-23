import { Permissions, CommandInteraction } from 'discord.js';
import { Logger } from 'pino';
import CommandHandler from '../command-handler.type';
import createWebhook from './create.command';
import editWebhook from './edit.command';
import deleteWebhook from './delete.command';
import describeWebhooks from './get.command';

type SubcommandFunction = (interaction: CommandInteraction, logger: Logger) => Promise<void>;

const subcommands = new Map<string, SubcommandFunction>([
  ['create', createWebhook],
  ['delete', deleteWebhook],
  ['info', describeWebhooks],
  ['set', editWebhook],
  ['clear', editWebhook],
]);

const webhookHandler: CommandHandler = {
  guildOnly: true,
  requieredPermissions: [Permissions.FLAGS.MANAGE_WEBHOOKS],

  generator: async (interaction: CommandInteraction, logger: Logger): Promise<void> => {
    const subcommand = interaction.options.getSubcommand();
    const strategy = subcommands.get(subcommand);

    if (!strategy) {
      logger.warn(`Unknown subcommand: ${subcommand}`);
      return await interaction.reply({ content: 'Unknown subcommand', ephemeral: true });
    }
    return await strategy(interaction, logger);
  },
};

export default webhookHandler;
