import got from 'got';
import { inject, injectable } from 'tsyringe';
import { Deal } from './types/Deal';
import { Webhook } from './types/Webhook';

export interface IGamesDealsAPIClient {
  isNewDeal(redditThreadIdentifier: string): Promise<boolean>;
  insertNewDeal(deal: Deal): Promise<boolean>;
  removeWebhook(webhook: Webhook): Promise<boolean>;
  getAllWebhooks(): Promise<Webhook[]>;
}

@injectable()
export class GamesDealsAPIClient implements IGamesDealsAPIClient {
  constructor(@inject('gdApiBaseUrl') private readonly baseUrl: string) { }

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
    const respose = await got.post(`${this.baseUrl}/deals/`, {
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
    const response = await got.delete(`${this.baseUrl}/webhooks/${webhook.webhookId}`);

    if (response.statusCode === 204) {
      return true;
    }

    return false;
  };

  public getAllWebhooks = async () => await got.get(`${this.baseUrl}/webhooks`).json() as Webhook[];
}
