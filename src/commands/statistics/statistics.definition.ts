import {
  ApplicationCommandStructure, Constants,
} from 'eris';

const statisticsDefinition: ApplicationCommandStructure = {
  name: 'statistics',
  description: 'Bot statistics.',
  type: Constants.ApplicationCommandTypes.CHAT_INPUT,
};

export default statisticsDefinition;
