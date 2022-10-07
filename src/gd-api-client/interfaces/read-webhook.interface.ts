import type Webhook from './webhook.interface';

export default interface ReadWebhook extends Webhook {
  readonly createdAt: string;
  readonly updatedAt: string;
}
