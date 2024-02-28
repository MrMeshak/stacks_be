import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { StackMoveDto } from './dto/stackMove.dto';
import { TaskMoveDto } from './dto/taskMove.dto';
import { and, eq } from 'drizzle-orm';
import * as schema from '../../drizzle/schema';
import { projects } from '../../drizzle/schema';
import { InvalidInputError, NotFoundError } from 'src/utils/base/errors';

@Injectable()
export class DndService {
  constructor(
    @Inject('DrizzleClient')
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async stackMove(userId: string, data: StackMoveDto) {
    const { projectId, stackOrder } = data;
    const project = await this.db.query.projects.findFirst({
      where: and(eq(projects.id, projectId), eq(projects.userId, userId)),
    });
    if (!project) {
      throw new NotFoundError('Project could not be found');
    }
    if (project.stackOrder.length !== stackOrder.length) {
      throw new InvalidInputError('Invalid stackOrder');
    }
    if (!project.stackOrder.every((stackId) => stackOrder.includes(stackId))) {
      throw new InvalidInputError('Invalid stackOrder');
    }
    await this.db
      .update(projects)
      .set({
        stackOrder: stackOrder,
      })
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)));
  }

  async taskMove(userId: string, data: TaskMoveDto) {}
}
