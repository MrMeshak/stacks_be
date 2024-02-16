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
import { AuthGuard } from 'src/guards/auth.guard';
import { StackService } from './stack.service';
import { AuthContextDec } from 'src/utils/decorators/auth-context.decorator';
import { AuthContext } from 'src/middleware/auth.middleware';
import { CreateStackDto } from './dto/createStack.dto';
import { AuthController } from '../auth/auth.controller';

@UseGuards(AuthGuard)
@Controller('stacks')
export class StackController {
  constructor(private readonly stackService: StackService) {}

  @Get(':stackId')
  async findStackById(
    @Param('stackId', ParseUUIDPipe) stackId: string,
    @AuthContextDec() authContext: AuthContext,
  ) {
    const stack = await this.stackService.findStackById(
      authContext.userId,
      stackId,
    );

    if (!stack) {
      throw new NotFoundException('Stack could not be found');
    }

    return stack;
  }

  @Post(':projectId')
  async createStack(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() data: CreateStackDto,
    @AuthContextDec() authContext: AuthContext,
  ) {
    try {
      await this.stackService.createStack(authContext.userId, projectId, data);
    } catch (error) {
      throw error;
    }
  }
}
