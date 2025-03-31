import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('4001'),
  JWT_SECRET: z.string().min(32).max(1024),
  API_KEY: z.string().min(1),
  NODE_ENV: z.enum(['development', 'prodduction', 'test']).default('development'),
  DATABASE_URL: z.string().url(),
  //AWS S3/Cloudflare R2
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_PUBLIC_URL: z.string().url(),
})

export const config = envSchema.parse(process.env);