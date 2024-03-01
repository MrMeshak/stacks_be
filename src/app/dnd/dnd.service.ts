import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { StackMoveDto } from './dto/stackMove.dto';
import { TaskMoveDto } from './dto/taskMove.dto';
import { and, eq } from 'drizzle-orm';
import * as schema from '../../drizzle/schema';
import { projects, stacks, tasks } from '../../drizzle/schema';
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

  async taskMove(userId: string, data: TaskMoveDto) {
    const {
      taskId,
      fromStackId,
      toStackId,
      fromStackTaskOrder,
      toStackTaskOrder,
    } = data;
    const taskPromise = this.db.query.tasks.findFirst({
      where: and(eq(tasks.id, taskId), eq(tasks.userId, userId)),
    });
    const fromStackPromise = this.db.query.stacks.findFirst({
      where: and(eq(stacks.id, fromStackId), eq(stacks.userId, userId)),
    });
    const toStackPromise = this.db.query.stacks.findFirst({
      where: and(eq(stacks.id, toStackId), eq(stacks.userId, userId)),
    });

    const [task, fromStack, toStack] = await Promise.all([
      taskPromise,
      fromStackPromise,
      toStackPromise,
    ]);

    if (!task) {
      throw new NotFoundError('Task could not be found');
    }
    if (!fromStack) {
      throw new NotFoundError('From stack could not be found');
    }
    if (!toStack) {
      throw new NotFoundError('To stack could not be found');
    }

    //Move within same stack
    if (fromStackId === toStackId) {
      if (toStack.taskOrder.length !== toStackTaskOrder.length) {
        throw new InvalidInputError('Invalid toStackTaskOrder');
      }

      if (
        !toStack.taskOrder.every((taskId) => toStackTaskOrder.includes(taskId))
      ) {
        throw new InvalidInputError('Invalid toStackTaskOrder');
      }

      await this.db.transaction(async (tx) => {
        await tx
          .update(tasks)
          .set({
            stackId: toStackId,
          })
          .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));

        await tx
          .update(stacks)
          .set({
            taskOrder: toStackTaskOrder,
          })
          .where(and(eq(stacks.id, toStackId), eq(stacks.userId, userId)));
      });
      return;
    }

    //Move across stacks
    if (toStack.taskOrder.length + 1 !== toStackTaskOrder.length) {
      throw new InvalidInputError('Invalid toStackTaskOrder');
    }

    if (
      !toStack.taskOrder.every((taskId) => toStackTaskOrder.includes(taskId)) ||
      !toStackTaskOrder.includes(taskId)
    ) {
      throw new InvalidInputError('Invalid toStackTaskOrder');
    }

    if (fromStack.taskOrder.length - 1 !== fromStackTaskOrder.length) {
      throw new InvalidInputError('Invalid fromStackTaskOrder');
    }
    if (
      !fromStack.taskOrder
        .filter((id) => id !== taskId)
        .every((taskId) => fromStackTaskOrder.includes(taskId))
    ) {
      throw new InvalidInputError('Invalid fromStackTaskOrder');
    }

    await this.db.transaction(async (tx) => {
      await tx
        .update(tasks)
        .set({
          stackId: toStackId,
        })
        .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));

      await tx
        .update(stacks)
        .set({
          taskOrder: toStackTaskOrder,
        })
        .where(and(eq(stacks.id, toStackId), eq(stacks.userId, userId)));

      await tx
        .update(stacks)
        .set({
          taskOrder: fromStackTaskOrder,
        })
        .where(and(eq(stacks.id, fromStackId), eq(stacks.userId, userId)));
    });
  }
}
