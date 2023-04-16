import { request } from 'undici';
import type { Webhook } from '../types';

export class WebhookResource {
  constructor(private readonly baseUrl: string) { }

  async remove(webhook: Pick<Webhook, 'id'>) {
    const response = await request(`${this.baseUrl}/webhooks/${webhook.id}`, {
      method: 'DELETE',
    });

    return response.statusCode === 204;
  }
}
