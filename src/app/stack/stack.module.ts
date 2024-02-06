import { Module } from '@nestjs/common';
import { StackController } from './stack.controller';
import { StackService } from './stack.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [StackController],
  providers: [StackService],
})
export class StackModule {}
