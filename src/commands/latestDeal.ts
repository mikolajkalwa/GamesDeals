import {
  CommandInteraction, Constants,
} from 'eris';
import gdapi from '../lib/APIClient';
import InteractionDefinition from '../lib/InteractionDefinition';

const latestDeal: InteractionDefinition = {
  name: 'latest',
  description: 'Information about latest found game.',
  type: Constants.ApplicationCommandTypes.CHAT_INPUT,

  generator: async (interaction: CommandInteraction) => {
    const deal = await gdapi.getLastDeal();
    if (!deal) {
      return interaction.createMessage('No deals found yet.');
    }
    const messageContent = `:calendar: **Found at:** ${deal.createdAt}\n`
        + `**${deal.redditTitle}**\n`
        + `<${deal.gameUrl}>\n`
        + `https://reddit.com/${deal.redditId}`;

    return interaction.createMessage(messageContent);
  },

};

export default latestDeal;
