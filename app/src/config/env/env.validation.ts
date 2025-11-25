import { z } from 'zod';

export const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z
        .string()
        .transform((val) => Number(val))
        .pipe(z.number().int().positive())
        .default(3000),
    DATABASE_URL: z.url(),
    REDIS_URL: z.url(),
    JWT_SECRET: z.string().min(16),
});

export type EnvVars = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): EnvVars {
    const parsed = envSchema.safeParse(config);

    if (!parsed.success) {
        console.error('Invalid environment configuration:');
        console.error(parsed.error.format());
        throw new Error('Invalid environment variables');
    }

    return parsed.data;
}
