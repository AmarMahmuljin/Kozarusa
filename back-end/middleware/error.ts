import { NextFunction, Request, Response } from "express";
import { AppError } from '../errors/AppError';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    console.error(err);
    if (err instanceof AppError) {
        return res.status(err.status).json({ message: err.message });
    }

    return res.status(500).json({ message: 'Internal server error' });
}