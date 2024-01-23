import postgres from 'postgres';
import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import { FactoryProvider } from '@nestjs/common';

export const drizzleProvider: FactoryProvider<
  PostgresJsDatabase<typeof schema>
> = {
  provide: 'DrizzleClient',
  useFactory: async () => {
    const queryClient = postgres(process.env.DB_URL);
    const db = drizzle(queryClient, { schema });
    return db;
  },
};
