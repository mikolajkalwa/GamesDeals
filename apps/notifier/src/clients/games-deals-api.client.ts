import { request } from 'undici';
import type { Webhook } from '../types/games-deal-api.type';

export class GamesDealsApiClient {
  constructor(private readonly baseUrl: string) { }

  async removeWebhook(webhook: Pick<Webhook, 'id'>) {
    const response = await request(`${this.baseUrl}/webhooks/${webhook.id}`, {
      method: 'DELETE',
    });

    return response.statusCode === 204;
  }
}
