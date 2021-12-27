import {
  CommandInteraction, InteractionDataOptionSubCommand, InteractionDataOptionSubCommandGroup, InteractionDataOptionWithValue,
} from 'eris';
import CommandError from '../../errors/command.error';
import parseArgs from '../../helpers/parseArgs';
import CommandHandler from '../../types/command-handler.type';
import createWebhook from './create.command';
import editWebhook from './edit.command';
import deleteWebhook from './delete.command';
import describeWebhooks from './info.command';
import { CreateWebhookArgs, DeleteWebhookArgs } from './arguments.types';

const webhookHandler: CommandHandler = {
  guildOnly: true,
  requieredPermissions: ['manageWebhooks'],

  // eslint-disable-next-line consistent-return
  generator: async (interaction: CommandInteraction): Promise<void> => {
    const [subcommandArgs] = interaction.data.options as InteractionDataOptionSubCommand[];

    switch (subcommandArgs.name) {
      case 'create': {
        const args = parseArgs<CreateWebhookArgs>(subcommandArgs.options as InteractionDataOptionWithValue[]);
        await createWebhook(interaction, args);
        break;
      }
      case 'edit': {
        const [subsubcommandArgs] = (subcommandArgs as unknown as InteractionDataOptionSubCommandGroup).options;
        await editWebhook(interaction, subsubcommandArgs as InteractionDataOptionSubCommand);
        break;
      }
      case 'delete': {
        const args = parseArgs<DeleteWebhookArgs>(subcommandArgs.options as InteractionDataOptionWithValue[]);
        await deleteWebhook(interaction, args);
        break;
      }
      case 'info': {
        await describeWebhooks(interaction);
        break;
      }
      default: {
        await interaction.createMessage('Unknown subcommand');
        throw new CommandError('Unknown subcommand type', interaction.data);
      }
    }
  },
};

export default webhookHandler;
