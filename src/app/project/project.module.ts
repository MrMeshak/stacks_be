import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
