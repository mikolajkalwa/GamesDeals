export type CreateWebhookArgs = {
  channel: string;
  role?: string;
  keywords?: string;
  blacklist?: string;
};

export type EditWebhookSetArgs = {
  webhook: string;
  role?: string;
  keywords?: string;
  blacklist?: string;
};

export type EditWebhookClearArgs = {
  webhook: string;
  role?: boolean;
  keywords?: boolean;
  blacklist?: boolean;
};

export type DeleteWebhookArgs = {
  webhook: string;
};
