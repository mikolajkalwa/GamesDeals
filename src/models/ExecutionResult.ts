import { Webhook } from './Webhook';

export interface ExecutionResult {
  webhooksToRemove: Webhook[];
  rateLimitedWebhooks: Webhook[];
  failedWebhooks: Webhook[];
  badRequestWebhooks: Webhook[];
}
