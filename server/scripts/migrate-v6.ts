import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function main() {
  const sql = neon(process.env.DATABASE_URL!);

  const exists = await sql`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'events')`;
  if (!exists[0]?.exists) {
    await sql(`
      CREATE TABLE events (
        id SERIAL PRIMARY KEY,
        title text NOT NULL,
        organizer text NOT NULL,
        organizer_type text NOT NULL DEFAULT 'other',
        date date NOT NULL,
        end_date date,
        time text,
        city text,
        format text NOT NULL DEFAULT 'offline',
        type text NOT NULL DEFAULT 'other',
        description text,
        link text,
        tags text[],
        created_at timestamp DEFAULT now()
      )
    `);
    console.log('Created events table');
  } else {
    console.log('events table already exists');
  }

  console.log('Migration v6 completed');
  process.exit(0);
}

main().catch((err: any) => { console.error(err); process.exit(1); });
