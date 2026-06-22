import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const parsingSessions = pgTable('parsing_sessions', {
  id: serial('id').primaryKey(),
  source: text('source').notNull(),
  category: text('category'),
  status: text('status').default('running'),
  totalPages: integer('total_pages').default(0),
  currentPage: integer('current_page').default(0),
  totalFound: integer('total_found').default(0),
  newVacancies: integer('new_vacancies').default(0),
  duplicatesSkipped: integer('duplicates_skipped').default(0),
  errorMessage: text('error_message'),
  startedAt: timestamp('started_at').defaultNow(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
});
