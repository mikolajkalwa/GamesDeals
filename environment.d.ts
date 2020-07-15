declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string;
      API_URL: string;
      INVITE_URL: string | null;
      SUPPORT_SERVER_URL: string | null;
    }
  }
}

export { };
