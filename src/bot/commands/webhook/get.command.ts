import { CommandInteraction } from 'discord.js';
import gdapi from '../../../gd-api-client';
import { printWebhookDetails } from './command.utils';

// eslint-disable-next-line consistent-return
const run = async (interaction: CommandInteraction) => {
  let content = '';
  const messageChunksToSend: string[] = [];
  const webhooks = await gdapi.getWebhooksForGuild((interaction.guildId as string));

  if (!webhooks.length) {
    return interaction.reply({ content: 'There are no webhooks configured for this guild.', ephemeral: true });
  }

  webhooks.forEach((webhook) => {
    const nextWebhook = printWebhookDetails(webhook);
    if (content.length + nextWebhook.length <= 2000) {
      content += printWebhookDetails(webhook);
    } else {
      messageChunksToSend.push(content);
      content = nextWebhook;
    }
  });
  messageChunksToSend.push(content);

  await Promise.all(messageChunksToSend.map(async (chunk) => interaction
    .followUp({
      content: chunk,
      allowedMentions: {
        parse: [],
      },
    })));
};

export default run;
