import { Pool } from 'undici';
import type { Webhook } from '../types/games-deal-api.type';

export class DiscordClient {
  private readonly client: Pool;

  constructor(private readonly baseUrl: string) {
    this.client = new Pool(this.baseUrl, {
      pipelining: 10,
      connections: 128,
    });
  }

  public executeWebhook = async (
    webhook: Pick<Webhook, 'id' | 'token'>,
    content: string,
    threadName?: string,
  ) => await this.client.request({
    path: `/api/webhooks/${webhook.id}/${webhook.token}?wait=true`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      thread_name: threadName,
      content,
    }),
  });
}
