import { Message } from 'eris';
import gdapi from '../lib/APIClient';
import logger from '../lib/logger';
import Time from '../helpers/Time';
import CommandDefinition from '../lib/CommandDefinition';

const lastDealCommand: CommandDefinition = {
  label: 'latestdeal',
  generator: async (msg: Message) => {
    const lastDeal = await gdapi.getLastDeal()
      .catch((e) => {
        logger.error({ e, message: 'Unable to get last deal' });
      });

    if (lastDeal) {
      const content = `:calendar: **Found at:** ${lastDeal.createdAt}\n`
        + `**${lastDeal.redditTitle}**\n`
        + `<${lastDeal.gameUrl}>\n`
        + `https://reddit.com/${lastDeal.redditId}`;
      msg.channel.createMessage(content);
    } else {
      msg.channel.createMessage(':exclamation: Unable to fetch last deal.');
    }
  },
  options: {
    aliases: ['ld', 'lastdeal'],
    cooldown: 15 * Time.SECOND,
    cooldownMessage: 'This command can be used once per 15 seconds.',
    cooldownReturns: 3,
    description: 'Information about latest found game.',
  },
};

export default lastDealCommand;
