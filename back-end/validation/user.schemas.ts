import { z } from 'zod';

export const roleSchema = z.enum(['user', 'guest', 'admin']);

export const authRequestSchema = z.object({
    username: z.string().min(3).max(50).transform(v => v.trim().toLowerCase()),
    password: z
        .string()
        .min(8, { message: 'must be at least 8 characters' })
        .regex(/[A-Z]/, 'must contain uppercase')
        .regex(/[a-z]/, 'must contain lowercase')
        .regex(/[0-9]/, 'must contain digit')
        .regex(/[^A-Za-z0-9]/, 'must contain special character'),
});

export const userInputSchema = z.object({
    username: z.string().min(3).max(50).transform(v => v.trim().toLowerCase()),
    password: z
        .string()
        .min(8, { message: 'must be at least 8 characters' })
        .regex(/[A-Z]/, 'must contain uppercase')
        .regex(/[a-z]/, 'must contain lowercase')
        .regex(/[0-9]/, 'must contain digit')
        .regex(/[^A-Za-z0-9]/, 'must contain special character'),
    firstName: z.string().min(1).max(100).transform(v => v.trim()),
    lastName: z.string().min(1).max(100).transform(v => v.trim()),
    email: z.string().email().transform(v => v.trim().toLowerCase()),
    role: roleSchema,
});