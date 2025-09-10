import jwt, { SignOptions } from 'jsonwebtoken';
import { Payload } from '../types';
import { config } from '../config';

export const generateJwtToken = (payload: Payload & { userId: number }): string => {
    const options: SignOptions = {
        expiresIn: config.JWT_EXPIRES_HOURS * 60 * 60,
        issuer: 'kozarusa',
        audience: 'kozarusa.app',
        subject: String(payload.userId),
    };
    return jwt.sign(payload, config.JWT_SECRET, options);
};

export const verifyJwt = <T = any>(token: string): T => {
    return jwt.verify(token, config.JWT_SECRET) as T;
};