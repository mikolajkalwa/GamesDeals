import {
  ApplicationCommandStructure, Constants,
} from 'eris';

const pingDefinition: ApplicationCommandStructure = {
  name: 'ping',
  description: 'Ping the bot to see if there are latency issues.',
  type: Constants.ApplicationCommandTypes.CHAT_INPUT,
};

export default pingDefinition;
