import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  
  // Add verification fields to profiles
  const profileAdditions = [
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'not_verified'`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_email text`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_code text`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_code_expires timestamp`,
  ];
  for (const stmt of profileAdditions) {
    await sql(stmt);
    console.log('Applied:', stmt.slice(0, 60));
  }

  // Create verification_documents table if not exists
  const exists = await sql`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'verification_documents')`;
  if (!exists[0]?.exists) {
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
  } else {
    console.log('verification_documents table already exists');
  }

  console.log('Migration completed');
  process.exit(0);
}
main().catch((err: any) => { console.error(err); process.exit(1); });
