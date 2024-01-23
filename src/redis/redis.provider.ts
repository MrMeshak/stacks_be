import { FactoryProvider } from '@nestjs/common';
import { Redis } from 'ioredis';

export const redisProvider: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: async () => {
    const redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.PORT),
    });
    return redisClient;
  },
};
