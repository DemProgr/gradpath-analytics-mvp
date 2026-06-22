import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const internships = pgTable('internships', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  company: text('company').notNull(),
  city: text('city'),
  salaryMin: integer('salary_min'),
  salaryMax: integer('salary_max'),
  salaryCurrency: text('salary_currency').default('BYN'),
  duration: text('duration'),
  type: text('type').notNull().default('paid'),
  category: text('category').notNull(),
  requirements: text('requirements').array(),
  description: text('description'),
  link: text('link'),
  sourceUrl: text('source_url'),
  postedAt: timestamp('posted_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});
