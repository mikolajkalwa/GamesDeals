import { ReadWebhook } from '../../helpers/APIClient';

// eslint-disable-next-line import/prefer-default-export
export const printWebhookDetails = (webhook: ReadWebhook): string => `**Webhook ID: ${webhook.id}**\n`
  + `Channel: <#${webhook.channel}>\n`
  + `Keywords: ${webhook.keywords?.length ? `${webhook.keywords.toString()}` : 'There are no keywords defined for this webhook.'}\n`
  + `Blacklist: ${webhook.blacklist?.length ? `${webhook.blacklist.toString()}` : 'There are no blacklisted words defined for this webhook.'}\n`
  + `Role to mention: ${webhook.role ? `<@&${webhook.role}>` : 'Role to mention is not defined for this webhook.'}\n`;
