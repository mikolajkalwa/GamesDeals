import '../env';

import { Client, Intents, Options } from 'discord.js';
import Cluster from 'discord-hybrid-sharding';
import { Pushgateway, collectDefaultMetrics, Registry } from 'prom-client';

import pino from 'pino';
import commands from './commands';

const logger = pino({
  level: 'debug',
});

const register = new Registry();
register.setDefaultLabels({ serviceName: `games-deals-cluster-${process.pid}` });
collectDefaultMetrics({ register });
const gateway = new Pushgateway(process.env.PROMETHEUS_GATEWAY, {}, register);

const client = new Client({
  shards: Cluster.data.SHARD_LIST,
  shardCount: Cluster.data.TOTAL_SHARDS,
  intents: [Intents.FLAGS.GUILDS],
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
client.cluster = new Cluster.Client(client);

client.on('ready', () => logger.info('Cluster is online'));
client.on('debug', (m) => logger.debug(m));
client.on('warn', (m) => logger.warn(m));
client.on('error', (m) => logger.error(m));

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) {
    await interaction.reply({ content: 'Command not found', ephemeral: true });
    logger.warn(`Command was not found ${interaction.commandName}`);
    return;
  }

  if (command.handler.guildOnly && !interaction.guildId) {
    await interaction.reply({ content: 'This command can be used only within a guild server', ephemeral: true });
    return;
  }

  if (command.handler.requieredPermissions?.length) {
    const hasPermissions = command.handler.requieredPermissions.every((requieredPermission) => interaction.memberPermissions?.has(requieredPermission));
    if (!hasPermissions) {
      await interaction.reply({ content: 'Sorry, you don\'t have permissions to do this!', ephemeral: true });
      return;
    }
  }

  command.handler.generator(interaction, logger).catch((error) => logger.error(error));
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
client.login(process.env.BOT_TOKEN);

setInterval(() => {
  gateway.push({ jobName: `games-deals-cluster-${process.pid}` })
    .then(() => logger.debug('Metrics pushed'))
    .catch((e) => logger.error(e));
}, 5 * 1000);
