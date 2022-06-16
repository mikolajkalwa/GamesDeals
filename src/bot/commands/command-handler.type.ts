import { CommandInteraction } from 'discord.js';
import { Logger } from 'pino';

type CommandHandler = {
  guildOnly?: boolean;
  requieredPermissions?: Array<bigint>;
  generator: (interaction: CommandInteraction, logger: Logger) => Promise<unknown>;
};

export default CommandHandler;
