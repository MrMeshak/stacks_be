import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../schema';
import { users, projects, stacks, tasks } from '../schema';
import { generateUsersData } from './data/usersData';
import { sql } from 'drizzle-orm';
import { generateProjectsData } from './data/projectsData';
import { generateStacksData } from './data/stacksData';
import { generateTasksData } from './data/taskData';

const main = async () => {
  const queryClient = postgres(process.env.DB_URL);
  const db = drizzle(queryClient, { schema });
  const usersData = await generateUsersData();
  const projectsData = generateProjectsData();
  const stacksData = generateStacksData();
  const tasksData = generateTasksData();

  console.log('Seeding start');
  await db
    .insert(users)
    .values(usersData)
    .onConflictDoUpdate({
      target: users.id,
      set: {
        password: sql`excluded.password`,
        firstName: sql`excluded.first_name`,
        lastName: sql`excluded.last_name`,
      },
    });

  await db
    .insert(projects)
    .values(projectsData)
    .onConflictDoUpdate({
      target: projects.id,
      set: {
        title: sql`excluded.title`,
        userId: sql`excluded.user_id`,
      },
    });

  await db
    .insert(stacks)
    .values(stacksData)
    .onConflictDoUpdate({
      target: stacks.id,
      set: {
        userId: sql`excluded.user_id`,
        projectId: sql`excluded.project_id`,
        title: sql`excluded.title`,
        color: sql`excluded.color`,
        taskOrder: sql`excluded.task_order`,
      },
    });

  await db
    .insert(tasks)
    .values(tasksData)
    .onConflictDoUpdate({
      target: tasks.id,
      set: {
        userId: sql`excluded.user_id`,
        stackId: sql`excluded.stack_id`,
        title: sql`excluded.title`,
        description: sql`excluded.description`,
        completed: sql`excluded.completed`,
      },
    });

  console.log('Seeding complete');
  process.exit(0);
};

main();
