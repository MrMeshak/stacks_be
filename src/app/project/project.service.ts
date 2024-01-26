import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../drizzle/schema';
import { projects } from '../../drizzle/schema';
import { and, eq } from 'drizzle-orm';

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
}
