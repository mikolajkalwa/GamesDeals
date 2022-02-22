export interface Webhook {
  id: string;
  token: string;
  guild: string;
  mention?: string;
  keywords: string[];
  blacklist: string[];
}
