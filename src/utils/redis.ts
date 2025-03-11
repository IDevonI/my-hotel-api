import Redis from 'ioredis';
import { config } from '../config';
import { logger } from './logger';

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  db: config.redis.db
});

redis.on('error', (err) => {
  logger.error(`Redis error: ${err}`);
});

redis.on('connect', () => {
  logger.info('Connected to Redis');
});


export const getCache = async <T>(key: string): Promise<T | null> => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

export const setCache = async (key: string, value: any, ttl?: number) => {
  const stringValue = JSON.stringify(value);
  return ttl ? await redis.setex(key, ttl, stringValue) : await redis.set(key, stringValue);
};


export const deleteCache = async (key: string) => {
  return await redis.del(key);
};

export default redis;
