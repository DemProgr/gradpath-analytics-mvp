import { pgTable, uuid, text, integer, doublePrecision, timestamp } from 'drizzle-orm/pg-core';
import { specialties } from './specialties';

export const admissionStats = pgTable('admission_stats', {
  id: uuid('id').defaultRandom().primaryKey(),
  specialtyId: text('specialty_id').notNull().references(() => specialties.id),
  year: integer('year').notNull(),
  budgetPlaces: integer('budget_places'),
  paidPlaces: integer('paid_places'),
  minScore: doublePrecision('min_score'),
  avgScore: doublePrecision('avg_score'),
  paidMinScore: doublePrecision('paid_min_score'),
  passingScoreBudget: doublePrecision('passing_score_budget'),
  passingScorePaid: doublePrecision('passing_score_paid'),
  applicationsCount: integer('applications_count'),
  enrolledCount: integer('enrolled_count'),
  createdAt: timestamp('created_at').defaultNow(),
});
