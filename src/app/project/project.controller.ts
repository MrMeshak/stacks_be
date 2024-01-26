import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthContext } from 'src/middleware/auth.middleware';
import { AuthContextDec } from 'src/utils/decorators/auth-context.decorator';
import { ProjectService } from './project.service';

@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async findAllProjects(@AuthContextDec() authContext: AuthContext) {
    const projects = await this.projectService.findAllProjects(
      authContext.userId,
    );

    return projects;
  }

  @Get(':projectId')
  async findProjectById(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @AuthContextDec() authContext: AuthContext,
  ) {
    const project = await this.projectService.findProjectById(
      authContext.userId,
      projectId,
    );

    if (!project) {
      throw new NotFoundException('Project could not be found');
    }

    return project;
  }
}
