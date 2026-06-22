import { pgTable, serial, integer, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const verificationDocuments = pgTable('verification_documents', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  fileUrl: text('file_url').notNull(),
  fileName: text('file_name'),
  status: text('status').default('pending'),
  rejectionReason: text('rejection_reason'),
  reviewedBy: integer('reviewed_by'),
  createdAt: timestamp('created_at').defaultNow(),
  reviewedAt: timestamp('reviewed_at'),
});
