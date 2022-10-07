export default interface PatchWebhook {
  mention?: string | null | undefined;
  keywords?: string[] | null | undefined;
  blacklist?: string[] | null | undefined;
}
