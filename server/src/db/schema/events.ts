import { pgTable, serial, text, timestamp, date } from 'drizzle-orm/pg-core';

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  organizer: text('organizer').notNull(),
  organizerType: text('organizer_type').notNull().default('other'),
  date: date('date').notNull(),
  endDate: date('end_date'),
  time: text('time'),
  city: text('city'),
  format: text('format').notNull().default('offline'),
  type: text('type').notNull().default('other'),
  description: text('description'),
  link: text('link'),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').defaultNow(),
});
