import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { faculties } from './faculties';
import { institutes } from './institutes';
import { universities } from './universities';

export const specialties = pgTable('specialties', {
  id: text('id').primaryKey(),
  facultyId: text('faculty_id').references(() => faculties.id),
  instituteId: text('institute_id').references(() => institutes.id),
  universityId: text('university_id').references(() => universities.id),
  name: text('name').notNull(),
  code: text('code'),
  degreeType: text('degree_type').notNull().default('bachelor'),
  durationYears: integer('duration_years').notNull().default(4),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
