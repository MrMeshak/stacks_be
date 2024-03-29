import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../drizzle/schema';
import { projects, stacks } from '../../drizzle/schema';
import { and, eq, sql } from 'drizzle-orm';
import { CreateStackDto } from './dto/createStack.dto';
import { randomUUID } from 'crypto';
import { UpdateStackDto } from './dto/updateStack.dto';
import { NotFoundError } from '../../utils/base/errors';

@Injectable()
export class StackService {
  constructor(
    @Inject('DrizzleClient')
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async findStackById(userId: string, stackId: string) {
    return await this.db.query.stacks.findFirst({
      where: and(eq(stacks.id, stackId), eq(stacks.userId, userId)),
    });
  }

  async createStack(userId: string, projectId: string, data: CreateStackDto) {
    await this.db.transaction(async (tx) => {
      const stackId = randomUUID();

      await tx
        .update(projects)
        .set({
          stackOrder: sql`array_append(${projects.stackOrder}, ${stackId})`,
        })
        .where(and(eq(projects.id, projectId), eq(projects.userId, userId)));

      await tx.insert(stacks).values({
        ...data,
        id: stackId,
        userId: userId,
        projectId: projectId,
      });
    });
  }

  async updateStack(userId: string, stackId: string, data: UpdateStackDto) {
    await this.db
      .update(stacks)
      .set({ ...data })
      .where(and(eq(stacks.id, stackId), eq(stacks.userId, userId)));
  }

  async deleteStack(userId: string, stackId: string) {
    const stackData = await this.db.query.stacks.findFirst({
      where: and(eq(stacks.id, stackId), eq(stacks.userId, userId)),
    });

    if (!stackData) {
      throw new NotFoundError('Stack could not be found');
    }

    await this.db.transaction(async (tx) => {
      await tx
        .update(projects)
        .set({
          stackOrder: sql`array_remove(${projects.stackOrder}, ${stackId})`,
        })
        .where(
          and(
            eq(projects.id, stackData.projectId),
            eq(projects.userId, userId),
          ),
        );

      await tx
        .delete(stacks)
        .where(and(eq(stacks.id, stackId), eq(stacks.userId, userId)));
    });
  }
}
