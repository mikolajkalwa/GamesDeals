export interface Deal {
  id: string;
  url: string;
  title: string;
  author: string;
  over18: boolean;
}

export interface Webhook {
  id: string;
  token: string;
  guild: string;
  mention?: string;
  keywords: string[];
  blacklist: string[];
  channelType: 'GUILD_TEXT' | 'GUILD_FORUM'
}
