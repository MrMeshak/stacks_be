import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

async function main() {
  console.log('migration started');
  const migrationsClient = postgres(process.env.DB_URL, {
    host: process.env.DB_,
    port: 5432,
    database: '',
    username: '',
    password: '',
    max: 1,
  });
  const db = drizzle(migrationsClient);
  await migrate(db, { migrationsFolder: './src/drizzle/migrations' });
  console.log('migration complete');
  process.exit(0);
}

main().catch((error) => {
  console.log(error);
  process.exit(0);
});
