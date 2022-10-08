import { Pool } from 'undici';
import type { Webhook } from './types/GamesDealsApi';

export default class DiscordClient {
  private readonly client: Pool;

  constructor(private readonly baseUrl: string) {
    this.client = new Pool(this.baseUrl, {
      pipelining: 10,
      connections: 128,
    });
  }

  public executeWebhook = async (webhook: Webhook, message: string) => {
    let content = message;
    if (Object.prototype.hasOwnProperty.call(webhook, 'mention') && webhook.mention) {
      if (webhook.mention === webhook.guild) {
        content = `@everyone ${message}`;
      } else {
        content = `<@&${webhook.mention}> ${message}`;
      }
    }

    const response = await this.client.request({
      path: `/api/webhooks/${webhook.id}/${webhook.token}?wait=true`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
      }),
    });
    return response;
  };
}
