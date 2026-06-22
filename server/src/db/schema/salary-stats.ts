import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const salaryStats = pgTable('salary_stats', {
  id: uuid('id').defaultRandom().primaryKey(),
  category: text('category').notNull(),
  specialtyName: text('specialty_name'),
  city: text('city'),
  avgSalary: integer('avg_salary').notNull(),
  minSalary: integer('min_salary'),
  maxSalary: integer('max_salary'),
  vacanciesCount: integer('vacancies_count'),
  demandLevel: text('demand_level').default('medium'),
  careerGrowthPotential: text('career_growth_potential').default('medium'),
  year: integer('year').notNull(),
  month: integer('month'),
  source: text('source').default('rabota.by'),
  createdAt: timestamp('created_at').defaultNow(),
});
