import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function main() {
  const sql = neon(process.env.DATABASE_URL!);

  const check = await sql`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles')`;
  const exists = check[0]?.exists;
  console.log('Profiles table exists:', exists);

  if (!exists) {
    const createSQL = `
      CREATE TABLE profiles (
        id SERIAL PRIMARY KEY,
        user_id integer REFERENCES users(id),
        display_name text,
        email text,
        university_id text REFERENCES universities(id),
        faculty_id text REFERENCES faculties(id),
        specialty_id text REFERENCES specialties(id),
        course integer,
        enrollment_year integer,
        expected_graduation_year integer,
        is_university_verified boolean DEFAULT false,
        verification_method text DEFAULT 'none',
        verification_status text DEFAULT 'not_verified',
        verification_email text,
        verification_code text,
        verification_code_expires timestamp,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      )
    `;
    await sql(createSQL);
    console.log('Created profiles table with all fields');
  } else {
    const additions = [
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS university_id text REFERENCES universities(id)`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS faculty_id text REFERENCES faculties(id)`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS specialty_id text REFERENCES specialties(id)`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS course integer`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS enrollment_year integer`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS expected_graduation_year integer`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_university_verified boolean DEFAULT false`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_method text DEFAULT 'none'`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'not_verified'`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_email text`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_code text`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_code_expires timestamp`,
    ];
    for (const stmt of additions) {
      await sql(stmt);
    }
    console.log('Added missing columns to profiles table');
  }

  // Create verification_documents table if not exists
  const docTableExists = await sql`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'verification_documents')`;
  if (!docTableExists[0]?.exists) {
    await sql(`
      CREATE TABLE verification_documents (
        id SERIAL PRIMARY KEY,
        user_id integer NOT NULL REFERENCES users(id),
        file_url text NOT NULL,
        file_name text,
        status text DEFAULT 'pending',
        rejection_reason text,
        reviewed_by integer,
        created_at timestamp DEFAULT now(),
        reviewed_at timestamp
      )
    `);
    console.log('Created verification_documents table');
  }

  console.log('Migration completed successfully');
  process.exit(0);
}

main().catch(err => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
