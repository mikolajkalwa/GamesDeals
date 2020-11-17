import { format } from 'date-fns';
import { ReadWebhook } from '../lib/APIClient';

// eslint-disable-next-line import/prefer-default-export
export const printWebhookDetails = (webhook: ReadWebhook): string => `Webhook ID: ${webhook.webhookId}\n`
  + `Created at: ${format(new Date(webhook.createdAt), "yyyy-MM-dd'T'HH:mm:ss")}\n`
  + `Updated at: ${format(new Date(webhook.updatedAt), "yyyy-MM-dd'T'HH:mm:ss")}\n`
  + `Keywords: ${webhook.keywords?.length ? `${webhook.keywords}` : 'There are no keywords defined for this webhook.'}\n`
  + `Blacklist: ${webhook.blacklist?.length ? `${webhook.blacklist}` : 'There are no blacklisted words defined for this webhook.'}\n`
  + `Role to mention: ${Object.prototype.hasOwnProperty.call(webhook, 'roleToMention') ? `${webhook.roleToMention}` : 'Role to mention is not defined for this webhook.'}\n`;
