import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const userRoles = pgTable('user_roles', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  role: text('role').default('user'),
  createdAt: timestamp('created_at').defaultNow(),
});
