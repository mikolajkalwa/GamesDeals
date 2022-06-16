import got from 'got';
import { Deal, Webhook } from './types/GamesDealsApi';

export default class GamesDealsAPIClient {
  constructor(private readonly baseUrl: string) { }

  public isNewDeal = async (redditThreadIdentifier: string) => {
    const response = await got.get(`${this.baseUrl}/deals/reddit/${redditThreadIdentifier}`, {
      throwHttpErrors: false,
    });

    if (response.statusCode === 404) {
      return true;
    }
    return false;
  };

  public insertNewDeal = async (deal: Deal) => {
    const respose = await got.post(`${this.baseUrl}/deals`, {
      json: {
        redditId: deal.id,
        redditTitle: deal.title,
        gameUrl: deal.url,
      },
      responseType: 'json',
    });

    if (respose.statusCode === 201) {
      return true;
    }
    return false;
  };

  public removeWebhook = async (webhook: Webhook) => {
    const response = await got.delete(`${this.baseUrl}/webhooks/${webhook.id}`);

    if (response.statusCode === 204) {
      return true;
    }

    return false;
  };

  public getAllWebhooks = async () => await got.get(`${this.baseUrl}/webhooks`).json<Webhook[]>();
}
