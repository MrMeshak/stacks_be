import { Module } from '@nestjs/common';
import { drizzleProvider } from './drizzle.provider';

@Module({
  imports: [],
  controllers: [],
  providers: [drizzleProvider],
  exports: [drizzleProvider],
})
export class DrizzleModule {}
