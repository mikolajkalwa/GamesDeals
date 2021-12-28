declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string;
      API_URL: string;
    }
  }
}

export { };
