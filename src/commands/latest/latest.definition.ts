import {
  ApplicationCommandStructure, Constants,
} from 'eris';

const latestDefinition: ApplicationCommandStructure = {
  name: 'latest',
  description: 'Information about latest found game.',
  type: Constants.ApplicationCommandTypes.CHAT_INPUT,
};

export default latestDefinition;
