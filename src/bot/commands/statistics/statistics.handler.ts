import type { CommandInteraction } from 'discord.js';
import type { Logger } from 'pino';
import gdapi from '../../../gd-api-client';
import type CommandHandler from '../command-handler.type';

const statistics: CommandHandler = {
  generator: async (interaction: CommandInteraction, logger: Logger) => {
    const dealsStatistics = await gdapi.getStatistics()
      .catch((e) => {
        logger.error(e, 'Unable to get statistics');
      });

    if (!dealsStatistics) {
      return await interaction.reply({
        content: ':exclamation: Unable to fetch deal statistics',
        ephemeral: true,
      });
    }

    return await interaction.reply({
      content: `:envelope: **Webhooks:** ${dealsStatistics.webhooksCount},\n:video_game: **Found Games:** ${dealsStatistics.dealsCount}`,
      ephemeral: true,
    });
  },
};

export default statistics;
