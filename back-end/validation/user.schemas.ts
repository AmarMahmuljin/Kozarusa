import { z } from 'zod';

export const roleSchema = z.enum(['user', 'guest', 'admin']);

export const authRequestSchema = z.object({
    username: z.string().min(3).max(50).transform(v => v.trim().toLowerCase()),
    password: z.string().min(8)
        .regex(/[A-Z]/, 'must contain uppercase')
        .regex(/[a-z]/, 'must contain lowercase')
        .regex(/[0-9]/, 'must contain digit'),
});

export const userInputSchema = z.object({
    username: z.string().min(3).max(50).transform(v => v.trim().toLowerCase()),
    password: z.string().min(8)
        .regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
    firstName: z.string().min(1).max(100).transform(v => v.trim()),
    lastName: z.string().min(1).max(100).transform(v => v.trim()),
    email: z.string().email().transform(v => v.trim().toLowerCase()),
    role: roleSchema,
});