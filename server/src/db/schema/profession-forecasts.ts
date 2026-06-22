import { pgTable, uuid, text, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const professionForecasts = pgTable('profession_forecasts', {
  id: uuid('id').defaultRandom().primaryKey(),
  professionName: text('profession_name').notNull(),
  category: text('category').notNull(),
  demandLevel: text('demand_level').notNull(),
  forecastYear: integer('forecast_year').notNull(),
  source: text('source').notNull(),
  city: text('city').notNull(),
  description: text('description'),
  relatedSpecialties: jsonb('related_specialties'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
