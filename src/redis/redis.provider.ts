import { FactoryProvider } from '@nestjs/common';
import { Redis } from 'ioredis';

export const redisProvider: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: async () => {
    const redisClient = new Redis(process.env.REDIS_URL);
    return redisClient;
  },
};
