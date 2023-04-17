import { config } from 'dotenv';
import { resolve } from 'path';
import { z } from 'zod';

config({ path: resolve(__dirname, '../.env') });

const ConfigSchema = z.object({
  NODE_ENV: z.string().regex(/development|test|production/).default('development'),
  LOG_LEVEL: z.string().default('info'),
  GAMES_DEALS_API_URL: z.string().url(),
  BOT_TOKEN: z.string(),
  PROMETHEUS_GATEWAY: z.string().url().optional(),
});

export type Config = z.infer<typeof ConfigSchema>;

const configuration = ConfigSchema.parse(process.env);

export default configuration;
