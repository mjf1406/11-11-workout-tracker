import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable('users',
  {
    user_id: text('user_id').notNull().primaryKey(),
    user_name: text('user_name').notNull(),
    user_email: text('user_email').notNull().unique(),
    user_role: text('user_role', { enum: ["user","admin"] }), // All users who sign up will be assigned the teacher role. Will need to manually assign admins.
    joined_date: text('joined_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_date: text('updated_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
  }
)
export const exercises = sqliteTable('exercises',
  {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    variant: text('variant'),
    body_part: text('body_part').notNull(),
    type: text('type'),
    created_date: text('created_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_date: text('updated_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
  }
)

export const workouts = sqliteTable('workouts', 
  {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    exercises: text('exercises', { mode: 'json' }).$type<{ foo: string }>(), // TODO: finish this type
    created_date: text('created_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_date: text('updated_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
  }
)


