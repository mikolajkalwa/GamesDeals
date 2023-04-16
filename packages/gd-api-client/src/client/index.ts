import { DealResource } from './resources/deal';
import { WebhookResource } from './resources/webhook';

export class GamesDealsApiClient {
  public readonly deal: DealResource;
  public readonly webhook: WebhookResource;

  constructor(baseUrl: string) {
    this.deal = new DealResource(baseUrl);
    this.webhook = new WebhookResource(baseUrl);
  }
}
