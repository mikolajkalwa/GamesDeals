import { ReadWebhook } from '../../helpers/APIClient';

// eslint-disable-next-line import/prefer-default-export
export const printWebhookDetails = (webhook: ReadWebhook): string => `Webhook ID: ${webhook.webhookId}\n`
  + `Created at: ${webhook.createdAt}\n`
  + `Updated at: ${webhook.updatedAt}\n`
  + `Keywords: ${webhook.keywords?.length ? `${webhook.keywords.toString()}` : 'There are no keywords defined for this webhook.'}\n`
  + `Blacklist: ${webhook.blacklist?.length ? `${webhook.blacklist.toString()}` : 'There are no blacklisted words defined for this webhook.'}\n`
  + `Role to mention: ${Object.prototype.hasOwnProperty.call(webhook, 'roleToMention') && webhook.roleToMention ? `${webhook.roleToMention}` : 'Role to mention is not defined for this webhook.'}\n`;
