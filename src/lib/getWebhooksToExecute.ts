import { Deal } from '../models/Deal';
import { Webhook } from '../models/Webhook';

const getWebhooksToExecute = (deal: Deal, webhooks: Webhook[]) => {
  const title = deal.title.toLowerCase();

  const webhooksToExecute = webhooks.filter((webhook) => {
    if (webhook.keywords.length === 0 && webhook.blacklist.length === 0) {
      return true;
    }

    const blacklistInterection = webhook.blacklist.filter(
      (keyword) => title.includes(keyword.toLowerCase()),
    );
    if (blacklistInterection.length) {
      return false;
    }

    const keywordsIntersection = webhook.keywords.filter(
      (keyword) => title.includes(keyword.toLowerCase()),
    );
    if (keywordsIntersection.length) {
      return true;
    }

    // if any of previous condiftion didn't match and webhook has keywords, do not execute
    if (webhook.keywords.length) {
      return false;
    }

    return true;
  });

  return webhooksToExecute;
};

export default getWebhooksToExecute;
