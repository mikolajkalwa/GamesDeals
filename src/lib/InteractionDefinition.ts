import { ApplicationCommandStructure, CommandInteraction, Constants } from 'eris';

type InteractionDefinition = {
  guildOnly?: boolean,
  requieredPermissions?: Array<keyof Constants['Permissions']>,
  generator: (interaction: CommandInteraction) => Promise<unknown>;
} & ApplicationCommandStructure;

export default InteractionDefinition;
