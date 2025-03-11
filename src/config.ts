import dotenv from 'dotenv';
import path from 'path';
import { logger } from './utils/logger';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const requiredVariables = ['PORT', 'NODE_ENV', 'JWT_SECRET', 'BCRYPT_SALT_ROUNDS', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'REDIS_HOST'];
const missingVariables = requiredVariables.filter(variable => !process.env[variable]);

if (missingVariables.length) {
  logger.warn(`Missing environment variables: ${missingVariables.join(', ')}`);
}


export const config = {
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'development',
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
  jwt: {
    secret: process.env.JWT_SECRET || '0d6d12a019b3ea51e884adca36f114fc518dd486f4b84831c17047dc5655ba24',
    accessTokenExpiration: '15m',
    refreshTokenExpiration: '7d',
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10)
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'my_hotel',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB || '0')
  },
  cuid: {
    length: 16,
    fingerprint: '87d53516bbb2d3a543e2fd902a9b017b15010e6b1ca9c67b108cbc176170f000'
  },
} as const;



export type Config = typeof config;
