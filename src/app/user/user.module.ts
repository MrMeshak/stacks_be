import { Inject, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../drizzle/schema';

@Module({
  imports: [DrizzleModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {
  constructor(
    @Inject('DrizzleClient')
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}
}
