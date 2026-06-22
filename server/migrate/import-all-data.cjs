const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const NEON_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_tWiTj3aXI9KB@ep-divine-forest-asi2eii5-pooler.c-4.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const MIGRATIONS_DIR = path.join(__dirname, '..', '..', 'supabase', 'migrations');
const pool = new Pool({ connectionString: NEON_URL, connectionTimeoutMillis: 30000 });

const SHORT_NAME_TO_ID = {
  'БГУ': 'bsu', 'БГУИР': 'bsuir', 'БНТУ': 'bntu', 'БГМУ': 'bsmu',
  'БГЭУ': 'bseu', 'БГПУ': 'bspu', 'БГУИЯ': 'bsuil', 'БГУКИ': 'bsuki',
  'БГУФК': 'bsufk', 'БГТУ': 'bstu', 'БГАА': 'bsaa',
  'Академия управления': 'academy-of-management',
  'Академия МВД': 'academy-mvd', 'БГАИ': 'bgai', 'БГАМ': 'bgam',
  'БГАС': 'bgas', 'Академия связи': 'academy-communications',
  'ВА': 'mil-academy', 'УГЗ': 'ugz', 'ИПС': 'ips',
  'УНАНБ': 'unanb', 'МГЭИ': 'mgei', 'ИСЗ': 'isz',
  'МИУП': 'miup', 'КБП': 'kbp', 'МИУ': 'miu',
  'БРУ': 'bru', 'Филиал РГСУ': 'rgsu-branch',
  'МГАК': 'mgak', 'МИНК': 'mink', 'БГУП': 'bgup',
  'БрГУ': 'brgu', 'БрГТУ': 'brgtu', 'ПолесскийГУ': 'polessu',
  'ВГУ': 'vgu', 'ВГМУ': 'vgmu', 'ВГТУ': 'vgtu',
  'БГАВМ': 'bgavm', 'ПолоцкийГУ': 'polotsk-gu',
  'ГГУ': 'ggu', 'ГГТУ': 'ggtu', 'ГГМУ': 'ggmu',
  'БГУТ': 'bgut', 'БТЭУ': 'bteu', 'МГПУ': 'mgpu',
  'ГрГУ': 'grgu', 'ГрГМУ': 'grgmu', 'ГрКБП': 'grkbp',
  'МГУ': 'mgu', 'МИ МВД': 'mi-mvd',
  'БГСХА': 'bgaa', 'БГАУ': 'bgau', 'СЭК': 'sek',
};

async function runSql(sql, label) {
  const stmts = sql.split(';').map(s=>s.trim()).filter(s=>s.length>10);
  let ok=0, err=0;
  for (const stmt of stmts) {
    try { await pool.query(stmt); ok++; }
    catch(e) { err++; if(err<=2) console.error(`  ERR: ${e.message.substring(0,80)}`); }
  }
  console.log(`  ${ok} OK, ${err} errors`);
}

async function main() {
  console.log('=== Importing data ===\n');

  // Clear all
  await pool.query('DELETE FROM admission_stats');
  await pool.query('DELETE FROM specialties');
  await pool.query('DELETE FROM institutes');
  await pool.query('DELETE FROM faculties');
  await pool.query('DELETE FROM universities');
  console.log('[CLEAR] done');

  // === 1. UNIVERSITIES ===
  console.log('[UNIVERSITIES]');
  let uniSql = fs.readFileSync(path.join(MIGRATIONS_DIR, 'populate_53_universities_final.sql'), 'utf8');

  // Extract VALUES: match between VALUES and ;
  const m = uniSql.match(/VALUES\s*\n([\s\S]*?);/);
  if (!m) throw new Error('No VALUES found');

  const valueLines = m[1].split(',\n').map(l => l.trim()).filter(l => l.startsWith('('));
  console.log(`  Parsing ${valueLines.length} universities`);

  for (const line of valueLines) {
    // Parse: ('name', 'short_name', 'city', 'website', 'description')
    const cleanLine = line.replace(/^\(|\);?$/g, '');
    const parts = cleanLine.split(/',\s*'/).map(p => p.replace(/^'|'$/g, ''));
    if (parts.length < 5) { console.error(`  SKIP: ${cleanLine.substring(0, 50)}`); continue; }

    const [name, shortName, city, website, desc] = parts;
    const id = SHORT_NAME_TO_ID[shortName];
    if (!id) { console.error(`  SKIP: no ID for ${shortName}`); continue; }

    try {
      await pool.query(
        `INSERT INTO universities (id, name, full_name, short_name, city, website, description)
         VALUES ($1, $2, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
        [id, name, shortName, city, website || null, desc || null]
      );
    } catch (e) {
      console.error(`  ERR ${shortName}: ${e.message.substring(0, 60)}`);
    }
  }

  const result = await pool.query('SELECT COUNT(*) FROM universities');
  console.log(`  Total: ${result.rows[0].count} universities`);

  // === 2. TRANSLATIONS ===
  console.log('[TRANSLATIONS]');
  let transSql = fs.readFileSync(path.join(MIGRATIONS_DIR, 'add_translations.sql'), 'utf8');
  transSql = transSql.split('\n').filter(l => {
    const t = l.trim().toUpperCase();
    return !t.startsWith('--') && !t.startsWith('ALTER') && t.length > 0;
  }).join('\n');
  await runSql(transSql, 'translations');

  // === 3. BSU FIX (faculties + specialties + scores) ===
  console.log('[BSU FIX]');
  for (const file of ['20260515_bsu_fix_schema_and_data.sql']) {
    let sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    sql = sql.split('\n').filter(l => {
      const t = l.trim().toUpperCase();
      return !t.startsWith('--') && !t.startsWith('CREATE TABLE') && !t.startsWith('CREATE INDEX')
        && !t.startsWith('ALTER TABLE') && !t.startsWith('DROP TABLE') && !t.startsWith('SELECT')
        && !t.startsWith('UNION') && !t.startsWith('TRUNCATE') && !t.startsWith('DELETE')
        && t.length > 0;
    }).join('\n');
    sql = sql.replace(/public\./g, '');
    sql = sql.replace(/ON CONFLICT[\s\S]*?(?=;\s*$|;\s*INSERT|;\s*$)/g, '');
    sql = sql.replace(/ON CONFLICT[\s\S]*?(;)/g, ';');
    await runSql(sql, file);
  }

  // === 4. Other data files ===
  const otherFiles = [
    '20260205054607_a486e754-9508-46bf-a4f7-7ed6f4dc0a83.sql',
    '20260205054642_e76d08a7-2d78-49c0-a068-ffca3010c19c.sql',
    '20260219_bsu_admission_stats.sql',
    '20260220_bsu_additional_data.sql',
    '20260221_bsu_complete_data.sql',
    '20260222_bntu_2022_data.sql',
    '20260223_bsu_2024_data.sql',
    '20260223_bsu_2025_data.sql',
    '20260223_bsu_2026_data.sql',
    '20260515_bsu_passing_scores_2025_full.sql',
    '20260520_bntu_faculties.sql',
    '20260520_bntu_passing_scores_2025.sql',
    '20260521_bntu_faculties_v3.sql',
    'bntu_fix.sql',
  ];

  for (const file of otherFiles) {
    const fp = path.join(MIGRATIONS_DIR, file);
    if (!fs.existsSync(fp)) { console.log(`[SKIP] ${file}`); continue; }

    let sql = fs.readFileSync(fp, 'utf8');
    sql = sql.split('\n').filter(l => {
      const t = l.trim().toUpperCase();
      return !t.startsWith('--') && !t.startsWith('CREATE TABLE') && !t.startsWith('CREATE INDEX')
        && !t.startsWith('ALTER TABLE') && !t.startsWith('DROP TABLE') && !t.startsWith('SELECT')
        && !t.startsWith('UNION') && !t.startsWith('TRUNCATE') && !t.startsWith('DELETE')
        && !t.startsWith('ENABLE') && !t.startsWith('GRANT') && !t.startsWith('CREATE POLICY')
        && t.length > 0;
    }).join('\n');
    sql = sql.replace(/public\./g, '');
    sql = sql.replace(/ON CONFLICT[\s\S]*?(?=;\s|$)/g, '');

    console.log(`[IMPORT] ${file}`);
    await runSql(sql, file);
  }

  // === VERIFICATION ===
  console.log('\n=== Verification ===');
  for (const table of ['universities', 'faculties', 'institutes', 'specialties', 'admission_stats']) {
    try {
      const r = await pool.query(`SELECT COUNT(*) as c FROM ${table}`);
      console.log(`  ${table}: ${r.rows[0].c} rows`);
    } catch (e) { console.log(`  ${table}: error`); }
  }

  await pool.end();
  console.log('\n=== Done ===');
}

main().catch(e => { console.error(e); process.exit(1); });
