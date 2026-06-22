/**
 * GradPath Data Migration Script
 * 
 * Run this locally: node migrate-data.cjs
 * It will:
 *   1. Fetch all data from Supabase REST API
 *   2. Insert into Neon PostgreSQL
 */

const SUPABASE_URL = 'https://hgihbaicflhahnhuzmdd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnaWhiYWljZmxoYWhuaHV6bWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxOTE0MzgsImV4cCI6MjA5MTc2NzQzOH0.oDHsUebuyeWHUmI1FYpwjLnmQE_j7MwnCs4pDiRVrdM';
const NEON_URL = 'postgresql://neondb_owner:npg_tWiTj3aXI9KB@ep-divine-forest-asi2eii5-pooler.c-4.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const TABLES = [
  { name: 'universities' },
  { name: 'faculties' },
  { name: 'institutes' },
  { name: 'specialties' },
  { name: 'admission_stats' },
  { name: 'vacancies' },
  { name: 'salary_stats' },
  { name: 'career_paths' },
  { name: 'parsing_sessions' },
  { name: 'profession_forecasts' },
  { name: 'profession_salaries' },
  { name: 'professions_salary' },
  { name: 'salary_statistics' },
];

async function fetchData(tableName) {
  const url = `${SUPABASE_URL}/rest/v1/${tableName}?select=*`;
  const res = await fetch(url, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!res.ok) {
    console.error(`  FAILED (${res.status} ${res.statusText})`);
    return [];
  }
  return res.json();
}

async function insertData(pool, tableName, rows) {
  if (rows.length === 0) return 0;

  const columns = Object.keys(rows[0]);
  const colList = columns.join(', ');

  let inserted = 0;
  const BATCH_SIZE = 100;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const values = batch.map(row => {
      const vals = columns.map(col => {
        const v = row[col];
        if (v === null || v === undefined) return 'NULL';
        if (typeof v === 'number') return String(v);
        if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
        if (typeof v === 'object') return `'${JSON.stringify(v).replace(/'/g, "''")}'`;
        return `'${String(v).replace(/'/g, "''")}'`;
      });
      return `(${vals.join(', ')})`;
    }).join(',\n');

    const sql = `INSERT INTO ${tableName} (${colList}) VALUES ${values} ON CONFLICT DO NOTHING`;
    try {
      await pool.query(sql);
      inserted += batch.length;
      process.stdout.write('.');
    } catch (err) {
      console.error(`\n  INSERT ERROR [${tableName} row ${i}]: ${err.message.substring(0, 100)}`);
    }
  }
  return inserted;
}

async function main() {
  console.log('=== GradPath Data Migration ===\n');

  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: NEON_URL });

  for (const table of TABLES) {
    process.stdout.write(`Fetching ${table.name}...`);
    const rows = await fetchData(table.name);
    console.log(` ${rows.length} rows`);

    process.stdout.write(`Inserting into Neon...`);
    const inserted = await insertData(pool, table.name, rows);
    console.log(` done (${inserted} inserted)`);
  }

  await pool.end();
  console.log('\n=== Migration Complete ===');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
