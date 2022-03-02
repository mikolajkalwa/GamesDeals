export default interface PatchWebhook {
  mention?: string | null;
  keywords?: string[] | null;
  blacklist?: string[] | null;
}
