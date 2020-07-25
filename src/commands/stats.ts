import { Message } from 'eris';
import bot from '../lib/bot';
import gdapi from '../lib/APIClient';
import logger from '../lib/logger';
import Time from '../lib/Time';
import CommandDefinition from '../lib/CommandDefinition';

const convertMs = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);

  const days = Math.floor(totalHours / 24);
  const seconds = totalSeconds % 60;
  const minutes = totalMinutes % 60;
  const hours = totalHours % 24;

  return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
};

const statsCommand: CommandDefinition = {
  label: 'stats',
  generator: async (msg: Message) => {
    let content = `:robot: **Uptime:** ${convertMs(bot.uptime)}\n`
      + `:chart_with_upwards_trend: **Memory usage:** ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB\n`
      + `:family: **Cached users:** ${bot.users.size}\n`
      + `:desktop: **Guilds:** ${bot.guilds.size}\n`
      + `:computer: **Shards:** ${bot.shards.size}\n`;

    const msgCopy = await msg.channel.createMessage(`${content}<a:processing:731581283938861085> Fetching more statistics...`);

    const statistics = await gdapi.getStatistics()
      .catch((e) => {
        logger.error({ e, message: 'Unable to get statistics' });
      });

    if (statistics) {
      content += `:envelope: **Webhooks:** ${statistics.webhooksCount},\n`
        + `:video_game: **Found Games:** ${statistics.dealsCount}`;
    } else {
      content += ':exclamation: Unable to fetch more statistics.';
    }
    msgCopy.edit(content);
  },
  options: {
    cooldown: 30 * Time.SECOND,
    description: 'Bot statistics.',
    fullDescription: 'Uptime, memory usage, cached users, guilds, webhooks, found games.',
    aliases: ['statistics', 'info'],
  },
};

export default statsCommand;
