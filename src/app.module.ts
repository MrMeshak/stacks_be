import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './app/user/user.module';
import { AuthModule } from './app/auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { ProjectModule } from './app/project/project.module';
import { DrizzleModule } from './drizzle/drizzle.module';
import { JwtModule } from './jwt/jwt.module';
import { StackModule } from './app/stack/stack.module';
import { TaskModule } from './app/task/task.module';
import { DndModule } from './app/dnd/dnd.module';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';

@Module({
  imports: [
    RedisModule,
    DrizzleModule,
    JwtModule,
    UserModule,
    AuthModule,
    ProjectModule,
    StackModule,
    TaskModule,
    DndModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
