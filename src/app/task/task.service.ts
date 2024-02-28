import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../drizzle/schema';
import { tasks } from '../../drizzle/schema';
import { and, eq } from 'drizzle-orm';
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
}
