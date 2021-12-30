import { CommandInteraction, InteractionDataOptionSubCommand, InteractionDataOptionWithValue } from 'eris';
import CommandError from '../../errors/command.error';
import { EditWebhookClearArgs, EditWebhookSetArgs } from './arguments.types';
import gdapi from '../../helpers/APIClient';
import { printWebhookDetails } from './webhook.utils';
import { parseArgs, parseOptions } from '../commands.utils';

// eslint-disable-next-line consistent-return
const clearPropertiesSubCommand = async (interaction: CommandInteraction, options: EditWebhookClearArgs) => {
  if (!options.blacklist && !options.keywords && !options.role) {
    return interaction.createMessage('No fields to update');
  }

  const updatedWebhook = await gdapi.patchWebhook(options.webhook, {
    keywords: options.keywords ? null : undefined,
    blacklist: options.blacklist ? null : undefined,
    role: options.role ? null : undefined,
  });
  await interaction.createMessage(`Webhook updated succesfully\n${printWebhookDetails(updatedWebhook)}`);
};

const setPropertiesSubCommand = async (interaction: CommandInteraction, options: EditWebhookSetArgs) => {
  const keywords = options.keywords ? parseArgs(options.keywords) : undefined;
  const blacklist = options.blacklist ? parseArgs(options.blacklist) : undefined;

  const updatedWebhook = await gdapi.patchWebhook(options.webhook, {
    keywords,
    blacklist,
    role: options.role,
  });
  await interaction.createMessage(`Webhook updated succesfully\n${printWebhookDetails(updatedWebhook)}`);
};

// eslint-disable-next-line consistent-return
const run = async (interaction: CommandInteraction, options: InteractionDataOptionSubCommand) => {
  const args = parseOptions<EditWebhookClearArgs | EditWebhookSetArgs>(options.options as InteractionDataOptionWithValue[]);

  const webhooks = await gdapi.getWebhooksForGuild((interaction.guildID as string));
  const [webhook] = webhooks.filter((x) => x.id === args.webhook);

  if (!webhook) {
    return interaction.createMessage('Webhook with provided ID doesn\'t exist.');
  }

  switch (options.name) {
    case 'clear': {
      await clearPropertiesSubCommand(interaction, args as EditWebhookClearArgs);
      break;
    }
    case 'set': {
      await setPropertiesSubCommand(interaction, args as EditWebhookSetArgs);
      break;
    }
    default: {
      await interaction.createMessage('Unknown subcommand');
      throw new CommandError('Unknown subcommand type', interaction.data);
    }
  }
};

export default run;
