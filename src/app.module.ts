import { Module } from '@nestjs/common';
import { UserModule } from './app/user.module';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
