import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../drizzle/schema';
import { projects } from '../../drizzle/schema';
import { and, eq } from 'drizzle-orm';
import { CreateProjectDto } from './dto/createProject.dto';
import { randomUUID } from 'crypto';

type NewProject = typeof projects.$inferInsert;

@Injectable()
export class ProjectService {
  constructor(
    @Inject('DrizzleClient')
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async findAllProjects(userId: string) {
    return await this.db.query.projects.findMany({
      where: eq(projects.userId, userId),
    });
  }

  async findProjectById(userId: string, projectId: string) {
    return await this.db.query.projects.findFirst({
      where: and(eq(projects.id, projectId), eq(projects.userId, userId)),
      with: {
        stacks: {
          columns: { id: true },
        },
      },
    });
  }

  async createProject(userId: string, data: CreateProjectDto) {
    await this.db
      .insert(projects)
      .values({ ...data, id: randomUUID(), userId: userId });
  }
}
