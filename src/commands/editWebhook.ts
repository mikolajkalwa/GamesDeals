import {
  CommandInteraction, Constants, InteractionDataOptionSubCommand, InteractionDataOptionWithValue,
} from 'eris';
import InteractionDefinition from '../lib/InteractionDefinition';
import gdapi from '../lib/APIClient';
import { printWebhookDetails } from '../helpers/webhookHelpers';
import CommandError from '../errors/command.error';
import { EditWebhookArgs } from '../helpers/commandsTypes';

const editWebhook: InteractionDefinition = {
  name: 'editwebhook',
  description: 'Edit previously created webhook.',
  type: Constants.ApplicationCommandTypes.CHAT_INPUT,
  options: [
    {
      description: 'Set new properties',
      name: 'set',
      type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'webhook',
          description: 'ID of webhook to edit',
          type: Constants.ApplicationCommandOptionTypes.STRING,
          required: true,
        },
        {
          name: 'role',
          description: 'Select role to mention whan a new deal is found',
          type: Constants.ApplicationCommandOptionTypes.ROLE,
          required: false,
        },
        {
          name: 'keywords',
          description: 'Keywords list, separated by space (for multiword wrap in double quotes)',
          type: Constants.ApplicationCommandOptionTypes.STRING,
          required: false,
        },
        {
          name: 'blacklist',
          description: 'BLacklisted keywords list, separated by space (for multiword wrap in double quotes)',
          type: Constants.ApplicationCommandOptionTypes.STRING,
          required: false,
        },
      ],
    },
    {
      description: 'Clear previously set properties',
      name: 'clear',
      type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'webhook',
          description: 'ID of webhook to edit',
          type: Constants.ApplicationCommandOptionTypes.STRING,
          required: true,
        },
        {
          name: 'role',
          description: 'Select true to clear role to mention',
          type: Constants.ApplicationCommandOptionTypes.BOOLEAN,
          required: false,
        },
        {
          name: 'keywords',
          description: 'Select true to clear keywords',
          type: Constants.ApplicationCommandOptionTypes.BOOLEAN,
          required: false,
        },
        {
          name: 'blacklist',
          description: 'Select true to clear blacklist',
          type: Constants.ApplicationCommandOptionTypes.BOOLEAN,
          required: false,
        },
      ],
    },
  ],
  guildOnly: true,
  requieredPermissions: ['manageWebhooks'],

  // eslint-disable-next-line consistent-return
  generator: async (interaction: CommandInteraction): Promise<void> => {
    if (!interaction.data.options?.length) {
      throw new CommandError('Missing interaction data', interaction.data);
    }

    const [subCommandArgs] = interaction.data.options;
    const args = Object.fromEntries(((subCommandArgs as InteractionDataOptionSubCommand).options as InteractionDataOptionWithValue[]).map((option) => [option.name, option.value])) as EditWebhookArgs;
    args.subcommand = subCommandArgs.name;

    const webhooks = await gdapi.getWebhooksForGuild((interaction.guildID as string));
    const filteredWebhooks = webhooks.filter((webhook) => webhook.webhookId === args.webhook);

    if (!filteredWebhooks.length) {
      return interaction.createMessage('Webhook with provided ID doesn\'t exist.');
    }

    let patchPayload;

    switch (args.subcommand) {
      case 'clear': {
        patchPayload = {
          keywords: args.keywords ? null : undefined,
          blacklist: args.blacklist ? null : undefined,
          roleToMention: args.role ? null : undefined,
        };
        break;
      }
      case 'set': {
        patchPayload = {
          keywords: (args.keywords as string)?.match(/(?:[^\s"]+|"[^"]*")+/g) || undefined,
          blacklist: (args.blacklist as string)?.match(/(?:[^\s"]+|"[^"]*")+/g) || undefined,
          roleToMention: args.role ? `<@&${args.role as string}>` : undefined,
        };
        break;
      }
      default: {
        throw new CommandError('Unknown subcommand type', interaction.data);
      }
    }

    const updatedWebhook = await gdapi.patchWebhook(args.webhook, patchPayload);
    await interaction.createMessage(`Webhook updated succesfully\n${printWebhookDetails(updatedWebhook)}`);

    return interaction.createMessage('Received');
  },
};

export default editWebhook;
