import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './app/user/user.module';
import { AuthModule } from './app/auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [UserModule, AuthModule, RedisModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
