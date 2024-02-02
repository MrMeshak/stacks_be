import { relations } from 'drizzle-orm';
import {
  uuid,
  pgTable,
  varchar,
  timestamp,
  interval,
  text,
  boolean,
} from 'drizzle-orm/pg-core';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),

  email: varchar('email', { length: 256 }).notNull().unique(),
  password: varchar('password', { length: 256 }).notNull(),
  userStatus: varchar('user_status', { length: 256 })
    .notNull()
    .default(UserStatus.ACTIVE),
  firstName: varchar('first_name', { length: 256 }).notNull(),
  lastName: varchar('last_name', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  stacks: many(stacks),
  tasks: many(tasks),
  subTasks: many(subTasks),
}));

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),

  title: text('title').notNull(),
  stackOrder: text('stack_order').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  stacks: many(stacks),
}));

export const stacks = pgTable('stacks', {
  id: uuid('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id),

  title: text('title').notNull(),
  color: varchar('color', { length: 256 }).notNull(),
  taskOrder: text('task_order').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const stacksRelations = relations(stacks, ({ one, many }) => ({
  user: one(users, {
    fields: [stacks.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [stacks.projectId],
    references: [projects.id],
  }),
  tasks: many(tasks),
}));

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  stackId: uuid('stack_id')
    .notNull()
    .references(() => stacks.id),

  title: text('title').notNull(),
  description: text('description'),
  completed: boolean('completed').notNull().default(false),
  priority: text('priority'),
  status: text('status'),
  startDate: timestamp('startDate'),
  dueDate: timestamp('dueDate'),
  timeEstimate: interval('timeEstimate'),
  subTaskOrder: text('sub_task_order').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const taskRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  stack: one(stacks, {
    fields: [tasks.stackId],
    references: [stacks.id],
  }),
}));

export const subTasks = pgTable('subTasks', {
  id: uuid('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  taskId: uuid('task_id')
    .notNull()
    .references(() => tasks.id),

  title: text('title'),
  completed: boolean('completed'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const subTasksRelations = relations(subTasks, ({ one }) => ({
  user: one(users, {
    fields: [subTasks.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [subTasks.taskId],
    references: [tasks.id],
  }),
}));
