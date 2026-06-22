import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const professionSalaries = pgTable('profession_salaries', {
  id: uuid('id').defaultRandom().primaryKey(),
  professionName: text('profession_name').notNull(),
  searchQuery: text('search_query'),
  avgSalary: integer('avg_salary'),
  minSalary: integer('min_salary'),
  maxSalary: integer('max_salary'),
  vacanciesCount: integer('vacancies_count'),
  city: text('city').notNull().default('Минск'),
  year: integer('year').notNull(),
  month: integer('month').notNull(),
  source: text('source').notNull().default('rabota.by'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
