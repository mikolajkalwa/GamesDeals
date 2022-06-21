import ReadWebhook from '../../../gd-api-client/interfaces/read-webhook.interface';

export const printWebhookDetails = (webhook: ReadWebhook): string => `**Webhook ID: ${webhook.id}**\n`
  + `Channel: <#${webhook.channel}>\n`
  + `Keywords: ${webhook.keywords?.length ? `${webhook.keywords.toString()}` : 'None'}\n`
  + `Ignore: ${webhook.blacklist?.length ? `${webhook.blacklist.toString()}` : 'None'}\n`
  + `Role to mention: ${webhook.mention ? `<@&${webhook.mention}>` : 'None'}\n`;

export const parseArgs = (input: string | null): string[] | null => {
  if (!input) {
    return null;
  }
  return input.split(',').map((x) => x.trim()).filter((x) => x.length >= 3);
};
