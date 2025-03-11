import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { logger } from '../utils/logger';
import { UnauthorizedError } from '../errors/UnauthorizedError';

interface JwtPayload {
  userId: string;
  role: string;
}

export const authMiddleware = (requiredRole?: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Authentication attempt without proper token format');
      throw new UnauthorizedError('Invalid token format');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
      logger.debug(`Authenticated user: ${decoded.userId}`);

      req.user = {
        id: decoded.userId,
        role: decoded.role
      };

      if (requiredRole && decoded.role !== requiredRole) {
        logger.warn(`Unauthorized access attempt by user ${decoded.userId}`);
        throw new UnauthorizedError('Insufficient permissions');
      }

      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Token verification failed: ${error.message}`);
      }
      

      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Token expired');
      }
      
      throw new UnauthorizedError('Invalid token');
    }
  };
};
