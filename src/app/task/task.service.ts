import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../drizzle/schema';
import { stacks } from '../../drizzle/schema';
import { tasks } from '../../drizzle/schema';
import { and, eq, sql } from 'drizzle-orm';
import { CreateTaskDto } from './dto/createTask.dto';
import { randomUUID } from 'crypto';
import { PatchTaskDto } from './dto/patchTask.dto';
import { NotFoundError } from 'src/utils/base/errors';

@Injectable()
export class TaskService {
  constructor(
    @Inject('DrizzleClient')
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async findTaskById(userId: string, taskId: string) {
    return await this.db.query.tasks.findFirst({
      where: and(eq(tasks.id, taskId), eq(tasks.userId, userId)),
    });
  }

  async createTask(userId: string, stackId: string, data: CreateTaskDto) {
    await this.db.transaction(async (tx) => {
      const taskId = randomUUID();

      await tx
        .update(stacks)
        .set({
          taskOrder: sql`array_append(${stacks.taskOrder}, ${taskId})`,
        })
        .where(and(eq(stacks.id, stackId), eq(stacks.userId, userId)));

      await tx.insert(tasks).values({
        ...data,
        id: taskId,
        userId: userId,
        stackId: stackId,
      });
    });
  }

  async patchTask(userId: string, taskId: string, data: PatchTaskDto) {
    await this.db
      .update(tasks)
      .set({
        ...data,
      })
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
  }

  async deleteTask(userId: string, taskId: string) {
    const taskData = await this.db.query.tasks.findFirst({
      where: and(eq(tasks.id, taskId), eq(tasks.userId, userId)),
    });
    if (!taskData) {
      throw new NotFoundError('Task could not be found');
    }

    await this.db.transaction(async (tx) => {
      await tx
        .update(stacks)
        .set({
          taskOrder: sql`array_remove(${stacks.taskOrder}, ${taskId})`,
        })
        .where(and(eq(stacks.id, taskData.stackId), eq(stacks.userId, userId)));

      await tx
        .delete(tasks)
        .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
    });
  }
}
