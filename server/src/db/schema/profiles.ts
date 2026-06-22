import { pgTable, serial, integer, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { universities } from './universities';
import { faculties } from './faculties';
import { specialties } from './specialties';

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  displayName: text('display_name'),
  email: text('email'),
  universityId: text('university_id').references(() => universities.id),
  facultyId: text('faculty_id').references(() => faculties.id),
  specialtyId: text('specialty_id').references(() => specialties.id),
  course: integer('course'),
  enrollmentYear: integer('enrollment_year'),
  expectedGraduationYear: integer('expected_graduation_year'),
  isUniversityVerified: boolean('is_university_verified').default(false),
  verificationMethod: text('verification_method').default('none'),
  verificationStatus: text('verification_status').default('not_verified'),
  verificationEmail: text('verification_email'),
  verificationCode: text('verification_code'),
  verificationCodeExpires: timestamp('verification_code_expires'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
