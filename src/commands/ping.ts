import {
  CommandInteraction, Constants,
} from 'eris';
import InteractionDefinition from '../lib/InteractionDefinition';

const ping: InteractionDefinition = {
  name: 'ping',
  description: 'Ping the bot to see if there are latency issues.',
  type: Constants.ApplicationCommandTypes.CHAT_INPUT,

  generator: async (interaction: CommandInteraction) => interaction.createMessage('**Pong!** :ping_pong:'),

};

export default ping;
