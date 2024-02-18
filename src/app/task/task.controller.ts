import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { AuthContextDec } from 'src/utils/decorators/auth-context.decorator';
import { AuthContext } from 'src/middleware/auth.middleware';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get(':taskId')
  async findTaskById(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @AuthContextDec() authContext: AuthContext,
  ) {
    const task = await this.taskService.findTaskById(
      authContext.userId,
      taskId,
    );

    if (!task) {
      throw new NotFoundException('Task could not be found');
    }

    return task;
  }
}
