export default interface Webhook {
  id: string;
  token: string;
  guild: string;
  channel: string;
  channelType: 'GUILD_TEXT' | 'GUILD_FORUM'
  mention?: string | undefined;
  keywords?: string[] | undefined;
  blacklist?: string[] | undefined;
}
