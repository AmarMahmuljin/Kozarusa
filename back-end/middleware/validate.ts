import { NextFunction, Request, Response } from "express";
import { ZodSchema } from 'zod';
import { AppError } from '../errors/AppError';

export const validate =
    (schema: ZodSchema) =>
    (req: Request, _res: Response, next: NextFunction) => {
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) {
            const msg = parsed.error.issues.map(i => i.message).join(', ');
            return next(new AppError(422, msg));
        }
        req.body = parsed.data;
        next();
    };