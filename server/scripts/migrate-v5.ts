import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function main() {
  const sql = neon(process.env.DATABASE_URL!);

  const exists = await sql`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'internships')`;
  if (!exists[0]?.exists) {
    await sql(`
      CREATE TABLE internships (
        id SERIAL PRIMARY KEY,
        title text NOT NULL,
        company text NOT NULL,
        city text,
        salary_min integer,
        salary_max integer,
        salary_currency text DEFAULT 'BYN',
        duration text,
        type text NOT NULL DEFAULT 'paid',
        category text NOT NULL,
        requirements text[],
        description text,
        link text,
        source_url text,
        posted_at timestamp DEFAULT now(),
        created_at timestamp DEFAULT now()
      )
    `);
    console.log('Created internships table');
  } else {
    console.log('internships table already exists');
  }

  console.log('Migration v5 completed');
  process.exit(0);
}

main().catch((err: any) => { console.error(err); process.exit(1); });
