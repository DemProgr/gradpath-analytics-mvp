const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_tWiTj3aXI9KB@ep-divine-forest-asi2eii5-pooler.c-4.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const pool = new Pool({ connectionString: DATABASE_URL, connectionTimeoutMillis: 30000 });

async function migrate() {
  console.log('Connecting to Neon...');
  let sql = fs.readFileSync(path.join(__dirname, '001_create_tables.sql'), 'utf8');

  sql = sql.replace(/^--.*$/gm, '');

  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && (s.toUpperCase().startsWith('CREATE') || s.toUpperCase().startsWith('DROP') || s.toUpperCase().startsWith('ALTER')));

  console.log(`Executing ${statements.length} SQL statements...`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    try {
      await pool.query(stmt);
      const label = stmt.substring(0, 30).replace(/\n/g, ' ');
      console.log(`  [${i+1}/${statements.length}] OK: ${label}...`);
    } catch (err) {
      console.error(`  [${i+1}/${statements.length}] ERROR: ${err.message}`);
    }
  }

  console.log('\nMigration complete!');
  await pool.end();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
