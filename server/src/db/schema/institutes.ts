import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { universities } from './universities';

export const institutes = pgTable('institutes', {
  id: text('id').primaryKey(),
  universityId: text('university_id').notNull().references(() => universities.id),
  name: text('name').notNull(),
  code: text('code'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
