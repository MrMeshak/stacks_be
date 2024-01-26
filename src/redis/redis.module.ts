import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { redisProvider } from './redis.provider';

@Module({
  imports: [],
  controllers: [],
  providers: [RedisService, redisProvider],
  exports: [RedisService],
})
export class RedisModule {}
