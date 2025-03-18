import { logger } from './utils/logger';

const requiredVariables = ['PORT', 'NODE_ENV', 'JWT_SECRET', 'DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'REDIS_HOST', 'REDIS_PORT', 'REDIS_PASSWORD', 'REDIS_DB'];
const missingVariables = requiredVariables.filter(variable => !process.env[variable]);

if (missingVariables.length) {
  logger.warn(`Missing environment variables: ${missingVariables.join(', ')}`);
}


export const config = {
  port: process.env.PORT || 3001,
  environment: process.env.NODE_ENV || 'development',
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
  jwt: {
    secret: process.env.JWT_SECRET || '0d6d12a019b3ea51e884adca36f114fc518dd486f4b84831c17047dc5655ba24',
    accessTokenExpiration: '15m',
    refreshSecret: process.env.REFRESH_SECRET || '98cefecfc2d1450e6fd6847c2d0e0554d74ed9a918b35e5b4f8426d2f862a4dc',
    refreshTokenExpiration: '7d'
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
    port: parseInt(process.env.REDIS_PORT || '6410'),
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB || '0')
  },
  cuid: {
    length: 16,
    fingerprint: 'okDIefPh1Z0qQgGUunZBbefisf8lM4Hb'
  },
} as const;



export type Config = typeof config;
