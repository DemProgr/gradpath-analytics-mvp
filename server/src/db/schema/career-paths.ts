import { pgTable, text, integer, doublePrecision, timestamp } from 'drizzle-orm/pg-core';

export const careerPaths = pgTable('career_paths', {
  id: text('id').primaryKey(),
  specialtyCategory: text('specialty_category').notNull(),
  levelName: text('level_name').notNull(),
  levelOrder: integer('level_order').notNull(),
  typicalSalaryMin: doublePrecision('typical_salary_min'),
  typicalSalaryMax: doublePrecision('typical_salary_max'),
  yearsExperience: text('years_experience'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});
