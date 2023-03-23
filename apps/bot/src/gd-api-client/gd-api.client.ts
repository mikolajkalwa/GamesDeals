import got, { Got } from 'got';
import config from '../config';
import type Deal from './interfaces/deal.interface';
import type PatchWebhook from './interfaces/patch-webhook.interface';
import type ReadWebhook from './interfaces/read-webhook.interface';
import type Statistics from './interfaces/statistics.interface';
import type Webhook from './interfaces/webhook.interface';

export default class GamesDealsApiClient {
  private readonly request: Got;

  constructor() {
    this.request = got.extend({
      prefixUrl: config.API_URL,
      timeout: 2500, // we have 3 seconds to respond to an interaction
    });
  }

  public async getStatistics(): Promise<Statistics> {
    return await this.request.get('statistics').json();
  }

  public async getLastDeal(): Promise<Deal | undefined> {
    const result: Deal[] = await this.request.get('deals/latest').json();
    return result[0];
  }

  public async getWebhooksForGuild(guildID: string): Promise<ReadWebhook[]> {
    return await this.request.get(`webhooks/guild/${guildID}`).json();
  }

  public async patchWebhook(webhookId: string, webhookPatch: PatchWebhook): Promise<ReadWebhook> {
    if (Object.values(webhookPatch).every((item) => item === undefined)) {
      throw new Error('No fields were provided to patch');
    }

    return await this.request.patch(`webhooks/${webhookId}`, {
      json: webhookPatch,
    }).json();
  }

  public async deleteWebhook(webhookId: string): Promise<void> {
    return await this.request.delete(`webhooks/${webhookId}`).json();
  }

  public async saveWebhook(webhook: Webhook): Promise<ReadWebhook> {
    return await this.request.post('webhooks', {
      json: webhook,
    }).json();
  }
}
