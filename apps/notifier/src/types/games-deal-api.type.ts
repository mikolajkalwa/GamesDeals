export type Webhook = {
  id: string;
  token: string;
  guild: string;
  mention?: string;
  keywords: string[];
  blacklist: string[];
  channelType: 'GUILD_TEXT' | 'GUILD_FORUM'
};
