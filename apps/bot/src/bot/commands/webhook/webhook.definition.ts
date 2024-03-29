import { ChannelType, SlashCommandBuilder } from 'discord.js';

const webhookDefinition = new SlashCommandBuilder()
  .setName('webhook')
  .setDescription('Manage webhooks')
  .addSubcommand((createSubcommand) => createSubcommand
    .setName('create')
    .setDescription('Create new webhook')
    .addChannelOption((option) => option
      .setName('channel')
      .setDescription('Select channel')
      .addChannelTypes(ChannelType.GuildText)
      .addChannelTypes(ChannelType.GuildForum)
      .setRequired(true))
    .addRoleOption((option) => option
      .setName('role')
      .setDescription('Select role to mention whan a new deal is found'))
    .addStringOption((option) => option
      .setName('keywords')
      .setDescription('Keywords list, separated by comma'))
    .addStringOption((option) => option
      .setName('ignore')
      .setDescription('Ignored words list, separated by comma')))
  .addSubcommand((readSubcommand) => readSubcommand
    .setName('info')
    .setDescription('Details about configured webhooks'))
  .addSubcommandGroup((editSubcommandGroup) => editSubcommandGroup
    .setName('edit')
    .setDescription('Edit webhook')
    .addSubcommand((setSubcommand) => setSubcommand
      .setName('set')
      .setDescription('Override previously configured properties')
      .addStringOption((option) => option
        .setName('webhook')
        .setDescription('ID of webhook to edit')
        .setRequired(true))
      .addRoleOption((option) => option
        .setName('role')
        .setDescription('Select role to mention whan a new deal is found'))
      .addStringOption((option) => option
        .setName('keywords')
        .setDescription('Keywords list, separated by comma'))
      .addStringOption((option) => option
        .setName('ignore')
        .setDescription('Ignored words list, separated by comma')))
    .addSubcommand((clearSubcommand) => clearSubcommand
      .setName('clear')
      .setDescription('Clear previously set properties')
      .addStringOption((option) => option
        .setName('webhook')
        .setDescription('ID of webhook to edit')
        .setRequired(true))
      .addBooleanOption((option) => option
        .setName('role')
        .setDescription('Select true to clear role to mention'))
      .addBooleanOption((option) => option
        .setName('keywords')
        .setDescription('Select true to clear keywords'))
      .addBooleanOption((option) => option
        .setName('ignore')
        .setDescription('Select true to clear ignored list'))))
  .addSubcommand((deleteSubcommand) => deleteSubcommand
    .setName('delete')
    .setDescription('Delete webhook')
    .addStringOption((option) => option
      .setName('webhook')
      .setDescription('ID of webhook to edit')
      .setRequired(true)));

export default webhookDefinition;
