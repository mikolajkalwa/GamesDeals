import { CommandInteraction } from 'discord.js';
import gdapi from '../../../gd-api-client';
import { printWebhookDetails } from './command.utils';

const SEPARATOR = ' -------\n';
// eslint-disable-next-line consistent-return
const run = async (interaction: CommandInteraction) => {
  let currentChunkContent: string[] = [];
  const chunksToSend: Array<string[]> = [];
  const webhooks = await gdapi.getWebhooksForGuild((interaction.guildId as string));

  if (!webhooks.length) {
    return interaction.reply({ content: 'There are no webhooks configured for this guild.', ephemeral: true });
  }

  webhooks.forEach((webhook) => {
    const nextWebhook = printWebhookDetails(webhook);
    const charactersInChunk = currentChunkContent.join('').length + (SEPARATOR.length * currentChunkContent.length);
    if (charactersInChunk + nextWebhook.length + SEPARATOR.length <= 2000) {
      currentChunkContent.push(printWebhookDetails(webhook));
    } else {
      chunksToSend.push([...currentChunkContent]);
      currentChunkContent = [];
      currentChunkContent.push(nextWebhook);
    }
  });

  chunksToSend.push(currentChunkContent);

  await interaction.deferReply();
  await Promise.all(chunksToSend.map(async (chunk) => interaction
    .followUp({
      content: chunk.join(SEPARATOR),
      allowedMentions: {
        parse: [],
      },
    })));
};

export default run;
