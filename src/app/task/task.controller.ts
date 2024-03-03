import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { AuthContextDec } from 'src/utils/decorators/auth-context.decorator';
import { AuthContext } from 'src/middleware/auth.middleware';
import { CreateTaskDto } from './dto/createTask.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
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

  @Post(':stackId')
  async createTask(
    @Param('stackId', ParseUUIDPipe) stackId: string,
    @Body() data: CreateTaskDto,
    @AuthContextDec() authContext: AuthContext,
  ) {
    try {
      await this.taskService.createTask(authContext.userId, stackId, data);
    } catch (error) {
      throw error;
    }
  }
}
