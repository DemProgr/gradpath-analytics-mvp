import { pgTable, text, doublePrecision, timestamp } from 'drizzle-orm/pg-core';

export const universities = pgTable('universities', {
  id: text('id').primaryKey(),
  shortName: text('short_name').notNull(),
  fullName: text('full_name').notNull(),
  name: text('name'),
  city: text('city').notNull().default(''),
  website: text('website'),
  description: text('description'),
  logoUrl: text('logo_url'),
  shortNameBe: text('short_name_be'),
  shortNameEn: text('short_name_en'),
  fullNameBe: text('full_name_be'),
  fullNameEn: text('full_name_en'),
  averageMark: doublePrecision('average_mark'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
