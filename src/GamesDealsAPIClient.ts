import { request } from 'undici';
import { Deal, Webhook } from './types/GamesDealsApi';

export default class GamesDealsAPIClient {
  constructor(private readonly baseUrl: string) { }

  public isNewDeal = async (redditThreadIdentifier: string) => {
    const response = await request(`${this.baseUrl}/deals/reddit/${redditThreadIdentifier}`);

    if (response.statusCode === 404) {
      return true;
    }
    return false;
  };

  public insertNewDeal = async (deal: Deal) => {
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
  };

  public removeWebhook = async (webhook: Webhook) => {
    const response = await request(`${this.baseUrl}/webhooks/${webhook.id}`, {
      method: 'DELETE',
    });

    if (response.statusCode === 204) {
      return true;
    }

    return false;
  };

  public getAllWebhooks = async () => {
    const response = await request(`${this.baseUrl}/webhooks`);
    return await response.body.json() as Webhook[];
  };
}
