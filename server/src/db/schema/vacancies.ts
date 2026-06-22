import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const vacancies = pgTable('vacancies', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  company: text('company'),
  city: text('city'),
  salaryMin: integer('salary_min'),
  salaryMax: integer('salary_max'),
  salaryCurrency: text('salary_currency').default('BYN'),
  experienceRequired: text('experience_required'),
  employmentType: text('employment_type'),
  sourceUrl: text('source_url'),
  description: text('description'),
  parsedAt: timestamp('parsed_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});
