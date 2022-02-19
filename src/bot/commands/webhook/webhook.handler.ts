import { Permissions, CommandInteraction } from 'discord.js';
import { Logger } from 'pino';
import CommandHandler from '../command-handler.type';
import createWebhook from './create.command';
import editWebhook from './edit.command';
import deleteWebhook from './delete.command';
import describeWebhooks from './get.command';

const webhookHandler: CommandHandler = {
  guildOnly: true,
  requieredPermissions: [Permissions.FLAGS.MANAGE_WEBHOOKS],

  // eslint-disable-next-line consistent-return
  generator: async (interaction: CommandInteraction, logger: Logger): Promise<void> => {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'create': {
        await createWebhook(interaction);
        break;
      }
      case 'edit': {
        await editWebhook(interaction, logger);
        break;
      }
      case 'delete': {
        await deleteWebhook(interaction, logger);
        break;
      }
      case 'info': {
        await describeWebhooks(interaction);
        break;
      }
      default: {
        logger.warn(`Unknown subcommand execution ${subcommand}`);
        await interaction.reply({ content: 'Unknown subcommand', ephemeral: true });
      }
    }
  },
};

export default webhookHandler;
