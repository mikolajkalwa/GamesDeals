import { resolve } from 'path';
import { config } from 'dotenv';
import { z } from 'zod';

config({ path: resolve(__dirname, '../.env') });

const ConfigSchema = z.object({
  NODE_ENV: z.string().regex(/development|test|production/).default('development'),
  API_URL: z.string().url(),
  BOT_TOKEN: z.string(),
  PROMETHEUS_GATEWAY: z.string().url().optional(),
});

export type Config = z.infer<typeof ConfigSchema>;

const configuration = ConfigSchema.parse(process.env);

export default configuration;
