import { request } from 'undici';
import { Deal, Webhook } from './types/GamesDealsApi';

export default class GamesDealsAPIClient {
  constructor(private readonly baseUrl: string) { }

  async isNewDeal(redditThreadIdentifier: string) {
    const response = await request(`${this.baseUrl}/deals/reddit/${redditThreadIdentifier}`);

    if (response.statusCode === 404) {
      return true;
    }
    return false;
  }

  async insertNewDeal(deal: Deal) {
    const respose = await request(`${this.baseUrl}/deals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        redditId: deal.id,
        redditTitle: deal.title,
        gameUrl: deal.url,
      }),
    });

    if (respose.statusCode !== 201) {
      const message = await respose.body.text();
      throw new Error(message);
    }
  }

  async removeWebhook(webhook: Webhook) {
    const response = await request(`${this.baseUrl}/webhooks/${webhook.id}`, {
      method: 'DELETE',
    });

    if (response.statusCode === 204) {
      return true;
    }

    return false;
  }

  async getAllWebhooks() {
    const response = await request(`${this.baseUrl}/webhooks`);
    return await response.body.json() as Webhook[];
  }
}
