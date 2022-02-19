export default interface Webhook {
  id: string;
  token: string;
  guild: string;
  channel: string;
  role?: string;
  keywords?: string[];
  blacklist?: string[];
}
