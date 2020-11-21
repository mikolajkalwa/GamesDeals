import got, { Response } from 'got';
import { Webhook } from './models/Webhook';

export interface IDiscordClient {
  executeWebhook(webhook: Webhook, message: string): Promise<Response<string>>;
}

export class DiscordClient implements IDiscordClient {
  // generate array of 500, 501, ..., 599
  static readonly statusesToRetry = [...Array(100).keys()].map((x) => x + 500);

  constructor(private readonly baseUrl: string) { }

  public executeWebhook = async (webhook: Webhook, message: string) => {
    let content = message;
    if (Object.prototype.hasOwnProperty.call(webhook, 'roleToMention')) {
      content = `${webhook.roleToMention} ${message}`;
    }

    const response = await got.post(`${this.baseUrl}/api/webhooks/${webhook.webhookId}/${webhook.webhookToken}`, {
      searchParams: {
        wait: true,
      },
      json: {
        content,
      },
      throwHttpErrors: false,
    });

    return response;
  };
}
