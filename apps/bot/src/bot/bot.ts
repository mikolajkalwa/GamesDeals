import {
  ChatInputCommandInteraction, Client, GatewayIntentBits, Options,
} from 'discord.js';
import got from 'got';
import pino from 'pino';
import config from '../config';
import commands from './commands';

const logger = pino({
  level: config.LOG_LEVEL ?? 'info',
});

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  makeCache: Options.cacheWithLimits({
    ApplicationCommandManager: 0, // guild.commands
    BaseGuildEmojiManager: 0, // guild.emojis
    GuildBanManager: 0, // guild.bans
    GuildInviteManager: 0, // guild.invites
    GuildMemberManager: 0, // guild.members
    GuildStickerManager: 0, // guild.stickers
    GuildScheduledEventManager: 0, // guild.scheduledEvents
    MessageManager: 0, // channel.messages
    PresenceManager: 0, // guild.presences
    ReactionManager: 0, // message.reactions
    ReactionUserManager: 0, // reaction.users
    StageInstanceManager: 0, // guild.stageInstances
    ThreadManager: 0, // channel.threads
    ThreadMemberManager: 0, // threadchannel.members
    UserManager: 0, // client.users
    VoiceStateManager: 0, // guild.voiceStates
  }),
});

client.on('debug', (m) => logger.debug(m, 'Debug event occured in Discord Client'));

client.on('interactionCreate', async (interaction) => {
  try {
    if (!interaction.isCommand()) return;
    logger.info(interaction, 'Executing interaction');

    const command = commands.get(interaction.commandName);

    if (!command) {
      await interaction.reply({ content: 'Command not found', ephemeral: true });
      logger.warn(`Command was not found ${interaction.commandName}`);
      return;
    }

    if (command.handler.guildOnly && !interaction.guildId) {
      await interaction.reply({ content: 'This command can be used only within a guild server', ephemeral: true });
      logger.warn('Guild only command was used in non guild channel');
      return;
    }

    if (command.handler.requieredPermissions?.length) {
      const hasPermissions = command.handler.requieredPermissions.every((requieredPermission) => interaction.memberPermissions?.has(requieredPermission));
      if (!hasPermissions) {
        await interaction.reply({ content: 'Sorry, you don\'t have permissions to do this!', ephemeral: true });
        return;
      }
    }

    command.handler.generator(interaction as ChatInputCommandInteraction, logger).catch((error: unknown) => {
      logger.error(error, 'Command handler error occured');
      if (error instanceof got.HTTPError) {
        logger.error(error.response, 'GamesDeals API returned non 2xx nor 3xx status code');
      }
    });
  } catch (error: unknown) {
    logger.error(error, 'interactionCreate event threw an error');
  }
});

client.login(config.BOT_TOKEN).catch((e) => {
  logger.error(e, 'Shard failed to login');
  process.exit(1);
});
