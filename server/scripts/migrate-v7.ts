import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function main() {
  const sql = neon(process.env.DATABASE_URL!);

  const exists = await sql`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'blogs')`;
  if (!exists[0]?.exists) {
    await sql(`
      CREATE TABLE blogs (
        id SERIAL PRIMARY KEY,
        title text NOT NULL,
        slug text NOT NULL UNIQUE,
        excerpt text,
        content text NOT NULL,
        author text NOT NULL,
        cover_image text,
        tags text[],
        published_at timestamp DEFAULT now(),
        created_at timestamp DEFAULT now()
      )
    `);
    console.log('Created blogs table');
  } else {
    console.log('blogs table already exists');
  }

  console.log('Migration v7 completed');
  process.exit(0);
}

main().catch((err: any) => { console.error(err); process.exit(1); });
