import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../drizzle/schema';
import { stacks } from '../../drizzle/schema';
import { tasks } from '../../drizzle/schema';
import { and, eq, sql } from 'drizzle-orm';
import { CreateTaskDto } from './dto/createTask.dto';
import { randomUUID } from 'crypto';
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
}
