import { CommandInteraction } from 'discord.js';
import CommandHandler from '../command-handler.type';
import gdapi from '../../../gd-api-client';

const latestDeal: CommandHandler = {

  generator: async (interaction: CommandInteraction) => {
    const deal = await gdapi.getLastDeal();
    if (!deal) {
      return await interaction.reply({ content: 'No deals found yet.', ephemeral: true });
    }
    const content = `:calendar: **Found at:** ${deal.createdAt}\n`
      + `**${deal.redditTitle}**\n`
      + `<${deal.gameUrl}>\n`
      + `https://reddit.com/${deal.redditId}`;

    return await interaction.reply({ content, ephemeral: true });
  },

};

export default latestDeal;
