import  {Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, AuthPayload, Role } from '../types';
import { UnauthenticatedError, ForbiddenError } from '../errors';

const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Authentication invalid');
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload;
        req.user = payload;
        next()
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid')
    }
}
const optionalAuth = (req: AuthRequest, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next()
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload
        req.user = payload
    } catch {}
    next()
}

const authorize = (...roles: Role[]) => {
    return (req: AuthRequest, _res: Response, next: NextFunction) => {
        const userRole = req.user?.role;
        if (!userRole || !roles.includes(userRole)) {
            throw new ForbiddenError('Access denied');
        }
        next();
    }
}

export { auth, optionalAuth, authorize }