import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function main() {
  const sql = neon(process.env.DATABASE_URL!);

  const tables = ['skills', 'languages', 'projects', 'certificates'];

  for (const table of tables) {
    const exists = await sql`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = ${table})`;
    if (!exists[0]?.exists) {
      let createSQL = '';
      switch (table) {
        case 'skills':
          createSQL = `
            CREATE TABLE skills (
              id SERIAL PRIMARY KEY,
              user_id integer NOT NULL REFERENCES users(id),
              name text NOT NULL,
              proficiency_level text NOT NULL DEFAULT 'intermediate',
              "order" integer NOT NULL DEFAULT 0,
              created_at timestamp DEFAULT now(),
              updated_at timestamp DEFAULT now()
            )
          `;
          break;
        case 'languages':
          createSQL = `
            CREATE TABLE languages (
              id SERIAL PRIMARY KEY,
              user_id integer NOT NULL REFERENCES users(id),
              name text NOT NULL,
              cefr_level text NOT NULL DEFAULT 'B1',
              "order" integer NOT NULL DEFAULT 0,
              created_at timestamp DEFAULT now(),
              updated_at timestamp DEFAULT now()
            )
          `;
          break;
        case 'projects':
          createSQL = `
            CREATE TABLE projects (
              id SERIAL PRIMARY KEY,
              user_id integer NOT NULL REFERENCES users(id),
              title text NOT NULL,
              description text,
              role text,
              url text,
              start_date timestamp,
              end_date timestamp,
              "order" integer NOT NULL DEFAULT 0,
              created_at timestamp DEFAULT now(),
              updated_at timestamp DEFAULT now()
            )
          `;
          break;
        case 'certificates':
          createSQL = `
            CREATE TABLE certificates (
              id SERIAL PRIMARY KEY,
              user_id integer NOT NULL REFERENCES users(id),
              name text NOT NULL,
              issuer text NOT NULL,
              url text,
              issue_date timestamp,
              expiry_date timestamp,
              "order" integer NOT NULL DEFAULT 0,
              created_at timestamp DEFAULT now(),
              updated_at timestamp DEFAULT now()
            )
          `;
          break;
      }
      await sql(createSQL);
      console.log(`Created table: ${table}`);
    } else {
      console.log(`Table already exists: ${table}`);
    }
  }

  console.log('Migration v3 completed');
  process.exit(0);
}

main().catch((err: any) => { console.error(err); process.exit(1); });
