import {
  ApplicationCommandStructure, Constants,
} from 'eris';

const webhookDefinition: ApplicationCommandStructure = {
  name: 'webhook',
  description: 'Manage webhooks',
  type: Constants.ApplicationCommandTypes.CHAT_INPUT,
  options: [
    {
      description: 'Create new webhook',
      name: 'create',
      type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'channel',
          description: 'Select channel',
          type: Constants.ApplicationCommandOptionTypes.CHANNEL,
          channel_types: [Constants.ChannelTypes.GUILD_TEXT],
          required: true,
        }, {
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
      description: 'Delete webhook',
      name: 'delete',
      type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'webhook',
          description: 'ID of webhook to edit',
          type: Constants.ApplicationCommandOptionTypes.STRING,
          required: true,
        },
      ],
    },
    {
      description: 'Edit webhook',
      name: 'edit',
      type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
      options: [
        {
          description: 'Override configured previously configured properties',
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
    },
    {
      description: 'Details about configured webhooks',
      name: 'info ',
      type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    },
  ],
};

export default webhookDefinition;
