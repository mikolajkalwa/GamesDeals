import { ApplicationCommandStructure, CommandInteraction } from 'eris';

type InteractionDefinition = {
  generator: (interaction: CommandInteraction) => Promise<unknown>;
} & ApplicationCommandStructure;

export default InteractionDefinition;
