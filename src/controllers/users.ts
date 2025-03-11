import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { getAuthInfo, getUser } from '../database/users';
import { config } from '../config';
import { logger } from '../utils/logger';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { NotFoundError } from '@errors/NotFoundError';
import argon2 from 'argon2';
import { User } from '../types/users';
import { getCUID } from 'src/utils/cuid';
import { createUser as createUserInDB } from 'src/database/users';


const hashPassword = async (password: string): Promise<string> => {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 5,
      parallelism: 2
    });
}

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await argon2.verify(hash, password);
};


export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
      try {
        const authInfo = await getAuthInfo(email);
        
        if (!authInfo || !authInfo.password_hash) {
          throw new UnauthorizedError('Invalid credentials');
        }
    
        const passwordMatch = await verifyPassword(password, authInfo.password_hash);
        
        if (!passwordMatch) {
          throw new UnauthorizedError('Invalid credentials');
        }

        const user = await getUser(authInfo.id);
        if (!user) {
          throw new NotFoundError('User not found');
        }

        const accessToken = jwt.sign(
          { userId: user.id, role: user.role },
          config.jwt.secret,
          { expiresIn: config.jwt.accessTokenExpiration }
        );
    
        const refreshToken = jwt.sign(
          { userId: user.id },
          config.jwt.secret,
          { expiresIn: config.jwt.refreshTokenExpiration }
        );
    
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000
        });
    
        res.json({
          accessToken,
          user
        });
    
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          logger.warn(`Failed login attempt for email: ${email}`);
          res.status(401).json({ message: 'Invalid credentials' });
        } else {
          logger.error(`Login error: ${error}`);
          res.status(500).json({ message: 'Internal server error' });
        }
      }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const passwordHash = await hashPassword(req.body.password);
    const cuid = getCUID();

    const user: User = {
      id: cuid,
      email: req.body.email,
      role: 'guest',
      name: req.body.name,
      password_hash: passwordHash,
      surname: req.body.surname,
      phone: req.body.phone
    }

    const result = await createUserInDB(user);

    if (result) {
      res.json({ message: 'User created successfully' });
    } else {
      throw new Error('Failed to create user');
    }
  } catch (error) {
    logger.error(`Create user error: ${error}`);
    res.status(500).json({ message: 'Internal server error' });
  }
}