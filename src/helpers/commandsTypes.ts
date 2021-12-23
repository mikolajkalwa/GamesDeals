export type CreateWebhookArgs = {
  channel: string;
  role?: string;
  keywords?: string;
  blacklist?: string;
};

type EditWebhookSetArgs = {
  role?: string;
  keywords?: string;
  blacklist?: string;
};

type EditWebhookClearArgs = {
  role?: boolean;
  keywords?: boolean;
  blacklist?: boolean;
};

export type EditWebhookArgs = {
  subcommand: string;
  webhook: string;
} & (EditWebhookClearArgs | EditWebhookSetArgs);
