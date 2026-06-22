import { pgTable, serial, integer, text, boolean, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './users';

export const surveys = pgTable('surveys', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  milestone: text('milestone').notNull(),
  isEmployed: boolean('is_employed'),
  country: text('country'),
  company: text('company'),
  position: text('position'),
  salary: integer('salary'),
  isInSpecialty: boolean('is_in_specialty'),
  employedAt: timestamp('employed_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userMilestoneUnique: uniqueIndex('user_milestone_unique').on(table.userId, table.milestone),
}));
