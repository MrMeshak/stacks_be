import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

export const drizzleProvider = {
  provide: 'DrizzleClient',
  useFactory: async () => {
    const queryClient = postgres(process.env.DATABASE_URL);
    return drizzle(queryClient, { schema });
  },
};
