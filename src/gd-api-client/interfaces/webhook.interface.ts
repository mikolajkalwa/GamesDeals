export default interface Webhook {
  id: string;
  token: string;
  guild: string;
  channel: string;
  mention?: string | undefined;
  keywords?: string[] | undefined;
  blacklist?: string[] | undefined;
}
