import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './app/user/user.module';
import { AuthModule } from './app/auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { ProjectModule } from './app/project/project.module';
import { DrizzleModule } from './drizzle/drizzle.module';
import { JwtModule } from './jwt/jwt.module';
import { StackModule } from './app/stack/stack.module';

@Module({
  imports: [
    RedisModule,
    DrizzleModule,
    JwtModule,
    UserModule,
    AuthModule,
    ProjectModule,
    StackModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
