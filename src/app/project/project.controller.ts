import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthContext } from 'src/middleware/auth.middleware';

@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectController {
  @Get(':id')
  getProject(@Param('id') id: string) {
    return { id };
  }
}
