export default interface Webhook {
  id: string;
  token: string;
  guild: string;
  channel: string;
  mention?: string;
  keywords?: string[];
  blacklist?: string[];
}
