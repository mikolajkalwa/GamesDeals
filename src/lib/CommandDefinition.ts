import { CommandGenerator, CommandOptions } from 'eris';

interface CommandDefinition {
  label: string;
  generator: CommandGenerator;
  options?: CommandOptions
}

export default CommandDefinition;
