import { CommandInteraction } from 'eris';
import CommandHandler from '../../types/command-handler.type';

const ping: CommandHandler = {
  generator: async (interaction: CommandInteraction) => interaction.createMessage('**Pong!** :ping_pong:'),
};

export default ping;
