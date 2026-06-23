import { pgTable, serial, integer, text, doublePrecision, timestamp } from 'drizzle-orm/pg-core';

export const regionSalaryStats = pgTable('region_salary_stats', {
  id: serial('id').primaryKey(),
  year: integer('year').notNull(),
  region: text('region').notNull(),
  avgSalary: doublePrecision('avg_salary'),
  source: text('source'),
  createdAt: timestamp('created_at').defaultNow(),
});
