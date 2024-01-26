import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { JwtModule } from 'src/jwt/jwt.module';

@Module({
  imports: [DrizzleModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
