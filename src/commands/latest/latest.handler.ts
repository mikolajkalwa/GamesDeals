import { CommandInteraction } from 'eris';
import CommandHandler from '../../types/command-handler.type';
import gdapi from '../../helpers/APIClient';

const latestDeal: CommandHandler = {

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
