import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { universities } from './universities';

export const faculties = pgTable('faculties', {
  id: text('id').primaryKey(),
  universityId: text('university_id').notNull().references(() => universities.id),
  name: text('name').notNull(),
  code: text('code'),
  description: text('description'),
  nameBe: text('name_be'),
  nameEn: text('name_en'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
