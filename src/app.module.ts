import { Module } from '@nestjs/common';
import { UserModule } from './app/user/user.module';
import { AuthModule } from './app/auth/auth.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [UserModule, AuthModule, RedisModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
