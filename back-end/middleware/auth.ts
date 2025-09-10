import { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../util/jwt';
import { Role } from '../types';
import { AppError } from '../errors/AppError';

export interface AuthRequest extends Request {
    user?: { userId: number; username: string; role: Role };
}

export const requireAuth = (req: AuthRequest, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return next(new AppError(401, 'Missing token'));
    try {
        req.user = verifyJwt(token);
        next();
    } catch (error) {
        next(new AppError(401, 'Invalid tolen'));
    }
};

export const requireRole = (roles: Role[]) => {
    return (req: AuthRequest, _res: Response, next: NextFunction) => {
        if (!req.user) return next(new AppError(401, 'Unauthorized'));
        if (!roles.includes(req.user.role)) return next(new AppError(403, 'Forbidden'));
        next();
    };
};