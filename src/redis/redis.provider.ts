import { FactoryProvider } from '@nestjs/common';
import { Redis } from 'ioredis';

export const redisProvider: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: async () => {
    const redisClient = new Redis(
      process.env.REDIS_URL || 'redis://red-cnn807f109ks73fveg6g:6379',
      {
        family: 0,
      },
    );
    return redisClient;
  },
};
