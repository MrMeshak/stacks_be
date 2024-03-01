import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { StackMoveDto } from './dto/stackMove.dto';
import { AuthContextDec } from 'src/utils/decorators/auth-context.decorator';
import { AuthContext } from 'src/middleware/auth.middleware';
import { DndService } from './dnd.service';
import { InvalidInputError, NotFoundError } from 'src/utils/base/errors';
import { TaskMoveDto } from './dto/taskMove.dto';

@UseGuards(AuthGuard)
@Controller('dnd')
export class DndController {
  constructor(private readonly dndService: DndService) {}

  @Post('stackMove')
  async stackMove(
    @Body() data: StackMoveDto,
    @AuthContextDec() authContext: AuthContext,
  ) {
    try {
      await this.dndService.stackMove(authContext.userId, data);
    } catch (error) {
      if (error instanceof InvalidInputError) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof NotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Post('taskMove')
  async taskMove(
    @Body() data: TaskMoveDto,
    @AuthContextDec() authContext: AuthContext,
  ) {
    try {
      await this.dndService.taskMove(authContext.userId, data);
    } catch (error) {
      if (error instanceof InvalidInputError) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof NotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
