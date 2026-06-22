-- Add university profile fields to existing profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS university_id text REFERENCES universities(id),
ADD COLUMN IF NOT EXISTS faculty_id text REFERENCES faculties(id),
ADD COLUMN IF NOT EXISTS specialty_id text REFERENCES specialties(id),
ADD COLUMN IF NOT EXISTS course integer,
ADD COLUMN IF NOT EXISTS enrollment_year integer,
ADD COLUMN IF NOT EXISTS expected_graduation_year integer,
ADD COLUMN IF NOT EXISTS is_university_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS verification_method text DEFAULT 'none';
