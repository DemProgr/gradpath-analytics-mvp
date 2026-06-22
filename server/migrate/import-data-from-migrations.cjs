const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const NEON_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_tWiTj3aXI9KB@ep-divine-forest-asi2eii5-pooler.c-4.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const MIGRATIONS_DIR = path.join(__dirname, '..', '..', 'supabase', 'migrations');

const pool = new Pool({ connectionString: NEON_URL, connectionTimeoutMillis: 30000 });

function cleanSql(sql) {
  sql = sql.replace(/^--.*$/gm, '');
  sql = sql.replace(/^ALTER TABLE.*$/gm, '');
  sql = sql.replace(/^TRUNCATE TABLE.*$/gm, '');
  sql = sql.replace(/^DROP TABLE.*$/gm, '');
  sql = sql.replace(/^DROP TYPE.*$/gm, '');
  sql = sql.replace(/^CREATE TABLE.*$/gm, '');
  sql = sql.replace(/^CREATE TYPE.*$/gm, '');
  sql = sql.replace(/^CREATE INDEX.*$/gm, '');
  sql = sql.replace(/^CREATE POLICY.*$/gm, '');
  sql = sql.replace(/^CREATE FUNCTION.*$/gm, '');
  sql = sql.replace(/^CREATE TRIGGER.*$/gm, '');
  sql = sql.replace(/^ALTER TABLE.*?ENABLE.*$/gm, '');
  sql = sql.replace(/^GRANT.*$/gm, '');
  sql = sql.replace(/^SELECT.*$/gm, '');
  sql = sql.replace(/^UPDATE.*SET.*(?!VALUES).*$/gm, '');
  sql = sql.replace(/^DELETE.*$/gm, '');
  sql = sql.replace(/public\./g, '');
  return sql;
}

async function runStatements(label, sql) {
  const stmts = sql.split(';').map(s => s.trim()).filter(s => s.length > 5);
  if (stmts.length === 0) return;

  console.log(`\n[${label}] ${stmts.length} statements`);
  let success = 0, errors = 0;
  for (const stmt of stmts) {
    try {
      await pool.query(stmt);
      success++;
      process.stdout.write('.');
    } catch (err) {
      errors++;
      process.stdout.write('x');
    }
  }
  console.log(` ${success} OK, ${errors} errors`);
}

async function main() {
  console.log('=== GradPath Data Import ===\n');

  // 1. Universities (53 records) - need to add name column
  await runStatements("ALTER TABLE universities ADD COLUMN IF NOT EXISTS name TEXT", "ALTER TABLE universities ADD COLUMN IF NOT EXISTS name TEXT;");
  
  let uniSql = fs.readFileSync(path.join(MIGRATIONS_DIR, 'populate_53_universities_final.sql'), 'utf8');
  uniSql = cleanSql(uniSql);
  uniSql = uniSql.replace(/INSERT INTO universities \(name,/g, 'INSERT INTO universities (id, name,');  // add id since we don't have name column
  // Actually, let's use full_name instead. Modify the INSERT.

  // Read and clean each data migration file
  const dataFiles = [
    { file: 'populate_53_universities_final.sql', adapt: (s) => {
      // Replace (name, short_name, city, website, description) with (short_name, full_name, city, website, description)
      // and wrap values to match column order
      return s.replace(
        /INSERT INTO universities \(name, short_name, city, website, description\) VALUES\n/g,
        'INSERT INTO universities (full_name, short_name, city, website, description) VALUES\n'
      );
    }},
    { file: 'add_translations.sql', adapt: (s) => s.replace(/^UPDATE universities SET.*$/gm, '') }, // skip, handle in server
    { file: '20260515_bsu_fix_schema_and_data.sql', adapt: (s) => s
      .replace(/INSERT INTO faculties \(id, university_id, name, code\)/g, 'INSERT INTO faculties (id, university_id, name, code)') 
      .replace(/INSERT INTO specialties \(id, university_id, name, code, faculty_id, institute_id\)/g, 'INSERT INTO specialties (id, university_id, name, code, faculty_id, institute_id)')
      .replace(/INSERT INTO admission_stats \(specialty_id, year, passing_score_budget, passing_score_paid, budget_places\)/g, 'INSERT INTO admission_stats (specialty_id, year, min_score, paid_min_score)')
      // Remove budget_places values (the 4th value after year, min_score, paid_min_score)
      .replace(/\(([^)]+)\)/g, (match) => {
        // If this is a VALUES row with 5 parts, convert to 3 parts by removing budget_places
        const parts = match.replace(/[()]/g, '').split(',').map(p => p.trim());
        if (parts.length === 5) {
          return `(${parts[0]}, ${parts[1]}, ${parts[2]}, ${parts[3]})`;
        }
        return match;
      })
    },
    { file: '20260205054607_a486e754-9508-46bf-a4f7-7ed6f4dc0a83.sql', adapt: (s) => s
      .replace(/INSERT INTO faculties /g, 'INSERT INTO faculties ')
      .replace(/\(SELECT id FROM universities WHERE short_name = '([^']+)'\)/g, "'$1'")
      .replace(/\(SELECT id FROM faculties WHERE name = '([^']+)' AND university_id = \(SELECT id FROM universities WHERE short_name = '([^']+)'\)\)/g, (m, name, uni) => {
        // Return university short_name as the university_id reference (UUID-based, so we need a mapping)
        return `'${uni}'`; 
      })
    },
    { file: '20260205054642_e76d08a7-2d78-49c0-a068-ffca3010c19c.sql', adapt: (s) => s },
    { file: '20260219_bsu_admission_stats.sql', adapt: (s) => s },
    { file: '20260220_bsu_additional_data.sql', adapt: (s) => s },
    { file: '20260221_bsu_complete_data.sql', adapt: (s) => s },
    { file: '20260222_bntu_2022_data.sql', adapt: (s) => s },
    { file: '20260223_bsu_2024_data.sql', adapt: (s) => s },
    { file: '20260223_bsu_2025_data.sql', adapt: (s) => s },
  ];

  for (const df of dataFiles) {
    const filePath = path.join(MIGRATIONS_DIR, df.file);
    if (!fs.existsSync(filePath)) {
      console.log(`[SKIP] ${df.file} - not found`);
      continue;
    }
    let sql = fs.readFileSync(filePath, 'utf8');
    sql = cleanSql(sql);
    sql = df.adapt(sql);
    if (sql.trim()) {
      await runStatements(df.file, sql);
    }
  }

  // Verify data
  console.log('\n=== Verification ===');
  const tables = ['universities', 'faculties', 'specialties', 'admission_stats'];
  for (const table of tables) {
    const result = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
    console.log(`  ${table}: ${result.rows[0].count} rows`);
  }

  await pool.end();
  console.log('\n=== Done ===');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
