declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      MONGO_URL: string;
      PORT: string
    }
  }
}

export { };
