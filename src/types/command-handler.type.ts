import { CommandInteraction, Constants } from 'eris';

type CommandHandler = {
  guildOnly?: boolean;
  requieredPermissions?: Array<keyof Constants['Permissions']>;
  generator: (interaction: CommandInteraction) => Promise<unknown>;
};

export default CommandHandler;
