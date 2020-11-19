export interface Webhook {
  webhookId: string;
  webhookToken: string;
  guildId: string;
  roleToMention?: string;
  keywords: string[];
  blacklist: string[];
}
