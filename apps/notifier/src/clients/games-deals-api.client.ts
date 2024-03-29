import { request } from 'undici';
import type { Deal, Webhook } from '../types/games-deal-api.type';

export class GamesDealsApiClient {
  constructor(private readonly baseUrl: string) { }

  async isNewDeal(redditThreadIdentifier: string) {
    const response = await request(`${this.baseUrl}/deals/reddit/${redditThreadIdentifier}`);
    return response.statusCode === 404;
  }

  async insertNewDeal(deal: Omit<Deal, 'author' | 'over18'>) {
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

  async removeWebhook(webhook: Pick<Webhook, 'id'>) {
    const response = await request(`${this.baseUrl}/webhooks/${webhook.id}`, {
      method: 'DELETE',
    });

    return response.statusCode === 204;
  }

  async getAllWebhooks() {
    const response = await request(`${this.baseUrl}/webhooks`);
    return await response.body.json() as Webhook[];
  }
}
