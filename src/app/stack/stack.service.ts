import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../drizzle/schema';
import { stacks } from '../../drizzle/schema';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class StackService {
  constructor(
    @Inject('DrizzleClient')
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async findStackById(userId: string, stackId: string) {
    return await this.db.query.stacks.findFirst({
      where: and(eq(stacks.id, stackId), eq(stacks.userId, userId)),
      with: {
        tasks: true,
      },
    });
  }
}
