import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import type { Exercise } from "./types";

export const users = sqliteTable('users',
  {
    user_id: text('user_id').notNull().primaryKey(),
    user_name: text('user_name').notNull(),
    user_email: text('user_email').notNull().unique(),
    user_role: text('user_role', { enum: ["user","admin"] }),
    joined_date: text('joined_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_date: text('updated_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
  }
)

export const exercises = sqliteTable('exercises',
  {
    id: integer('id', { mode: 'number' }).notNull().primaryKey({ autoIncrement: true }),
    user_id: text('user_id').notNull().references(() => users.user_id),
    name: text('name').notNull(),
    variant: text('variant'),
    body_part: text('body_part').notNull(),
    type: text('type'),
    used: integer('used', { mode: 'boolean' }),
    created_date: text('created_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_date: text('updated_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
  }, (table) => {
    return {
      user_id_exercises_idx: index("user_id_exercises_idx").on(table.user_id)
    }
  }
)

export const workouts = sqliteTable('workouts', 
  {
    id: integer('id', { mode: 'number' }).notNull().primaryKey({ autoIncrement: true }),
    user_id: text('user_id').notNull().references(() => users.user_id),
    exercises: text('exercises', { mode: 'json' }).$type<Exercise[]>(),
    created_date: text('created_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_date: text('updated_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
  }, (table) => {
    return {
      user_id_workouts_idx: index("user_id_workouts_idx").on(table.user_id)
    }
  }
)

export const settings = sqliteTable('settings',
  {
    user_id: text('user_id').notNull().primaryKey().references(() => users.user_id),
    upper_pull: integer('upper_pull').notNull(),
    upper_push: integer('upper_push').notNull(),
    lower: integer('lower').notNull(),
    abs: integer('abs').notNull(),
    sets: integer('sets').notNull(),
    rest_duration: integer('rest_duration').notNull(),
    created_date: text('created_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_date: text('updated_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
  }
)
