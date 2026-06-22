import { pgTable, uuid, text, doublePrecision, integer, timestamp } from 'drizzle-orm/pg-core';

export const professionsSalary = pgTable('professions_salary', {
  id: uuid('id').defaultRandom().primaryKey(),
  professionName: text('profession_name').notNull(),
  category: text('category').notNull(),
  minSalary: doublePrecision('min_salary'),
  maxSalary: doublePrecision('max_salary'),
  avgSalary: doublePrecision('avg_salary'),
  medianSalary: doublePrecision('median_salary'),
  currency: text('currency').default('BYN'),
  source: text('source'),
  region: text('region'),
  year: integer('year').default(2025),
  createdAt: timestamp('created_at').defaultNow(),
});
