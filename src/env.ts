import { resolve } from 'path';
import { config } from 'dotenv';
import Joi from 'joi';

config({ path: resolve(__dirname, '../.env') });

const schema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('development', 'test', 'production')
      .default('development'),
    API_URL: Joi.string().uri().required(),
    BOT_TOKEN: Joi.string().required(),
  })
  .unknown();

const { error } = schema.validate(process.env);

if (error) {
  throw error;
}
