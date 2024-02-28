import { Module } from '@nestjs/common';
import { DndController } from './dnd.controller';
import { DndService } from './dnd.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [DndController],
  providers: [DndService],
})
export class DndModule {}
