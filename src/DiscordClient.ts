import got from 'got';
import { Webhook } from './types/GamesDealsApi';

export default class DiscordClient {
  constructor(private readonly baseUrl: string) { }

  public executeWebhook = async (webhook: Webhook, message: string) => {
    let content = message;
    if (Object.prototype.hasOwnProperty.call(webhook, 'mention') && webhook.mention) {
      if (webhook.mention === webhook.guild) {
        content = `@everyone ${message}`;
      } else {
        content = `<@&${webhook.mention}> ${message}`;
      }
    }

    const response = await got.post(`${this.baseUrl}/api/webhooks/${webhook.id}/${webhook.token}`, {
      searchParams: {
        wait: true,
      },
      json: {
        content,
      },
      throwHttpErrors: false,
    });

    return response;
  };
}
