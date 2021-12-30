export interface Webhook {
  id: string;
  token: string;
  guild: string;
  role?: string;
  keywords: string[];
  blacklist: string[];
}
