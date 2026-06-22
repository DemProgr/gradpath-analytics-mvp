import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function main() {
  const sql = neon(process.env.DATABASE_URL!);

  const exists = await sql`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'surveys')`;
  if (!exists[0]?.exists) {
    await sql(`
      CREATE TABLE surveys (
        id SERIAL PRIMARY KEY,
        user_id integer NOT NULL REFERENCES users(id),
        milestone text NOT NULL,
        is_employed boolean,
        country text,
        company text,
        position text,
        salary integer,
        is_in_specialty boolean,
        employed_at timestamp,
        created_at timestamp DEFAULT now()
      )
    `);
    // Add unique constraint for (user_id, milestone)
    await sql`CREATE UNIQUE INDEX user_milestone_unique ON surveys (user_id, milestone)`;
    console.log('Created surveys table');
  } else {
    console.log('surveys table already exists');
  }

  console.log('Migration v4 completed');
  process.exit(0);
}

main().catch((err: any) => { console.error(err); process.exit(1); });
