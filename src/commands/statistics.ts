import {
  CommandInteraction, Constants,
} from 'eris';
import bot from '../lib/bot';
import gdapi from '../lib/APIClient';
import logger from '../lib/logger';

import InteractionDefinition from '../lib/InteractionDefinition';

const humanizeMs = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);

  const days = Math.floor(totalHours / 24);
  const seconds = totalSeconds % 60;
  const minutes = totalMinutes % 60;
  const hours = totalHours % 24;

  return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
};

const statistics: InteractionDefinition = {
  name: 'statistics',
  description: 'Bot statistics.',
  type: Constants.ApplicationCommandTypes.CHAT_INPUT,

  generator: async (interaction: CommandInteraction) => {
    let content = `:robot: **Uptime:** ${humanizeMs(bot.uptime)}\n`
      + `:chart_with_upwards_trend: **Memory usage:** ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB\n`
      + `:family: **Cached users:** ${bot.users.size}\n`
      + `:desktop: **Guilds:** ${bot.guilds.size}\n`
      + `:computer: **Shards:** ${bot.shards.size}\n`;

    const dealsStatistics = await gdapi.getStatistics()
      .catch((e) => {
        logger.error(e, 'Unable to get statistics');
      });

    if (dealsStatistics) {
      content += `:envelope: **Webhooks:** ${dealsStatistics.webhooksCount},\n`
        + `:video_game: **Found Games:** ${dealsStatistics.dealsCount}`;
    } else {
      content += ':exclamation: Unable to fetch more statistics.';
    }
    await interaction.createMessage(content);
  },

};

export default statistics;