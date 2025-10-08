import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production'] as const).default("development"),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(32, 'JWT_SECRET should be at least 32 chars'),
    JWT_EXPIRES_HOURS: z.coerce.number().int().positive().default(1),
    BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),
    CORS_ORIGIN: z.string().optional(),
});

export const config = envSchema.parse(process.env);
export const isProd = config.NODE_ENV === 'production';