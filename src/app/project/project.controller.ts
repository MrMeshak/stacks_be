import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthContext } from 'src/middleware/auth.middleware';
import { AuthContextDec } from 'src/utils/decorators/auth-context.decorator';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';
import { PatchProjectDto } from './dto/patchProject.dto';

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

  @Post()
  async createProject(
    @Body() data: CreateProjectDto,
    @AuthContextDec() authContext: AuthContext,
  ) {
    try {
      await this.projectService.createProject(authContext.userId, data);
    } catch (error) {
      throw error;
    }
  }

  @Put(':projectId')
  async updateProject(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() data: UpdateProjectDto,
    @AuthContextDec() authContext: AuthContext,
  ) {
    try {
      await this.projectService.updateProject(
        authContext.userId,
        projectId,
        data,
      );
    } catch (error) {
      throw error;
    }
  }

  @Patch(':projectId')
  async patchProject(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() data: PatchProjectDto,
    @AuthContextDec() authContext: AuthContext,
  ) {
    try {
      await this.projectService.patchProject(
        authContext.userId,
        projectId,
        data,
      );
    } catch (error) {
      throw error;
    }
  }

  @Delete(':projectId')
  async deleteProject(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @AuthContextDec() authContext: AuthContext,
  ) {
    try {
      await this.projectService.deleteProject(authContext.userId, projectId);
    } catch (error) {
      throw error;
    }
  }
}
