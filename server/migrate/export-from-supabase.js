/**
 * Migration script: Supabase → Neon
 * 
 * Run this script in Node.js to export data from Supabase as SQL INSERT statements.
 * Then run the generated SQL in Neon SQL Editor.
 * 
 * Usage:
 *   node migrate/export-from-supabase.js > migrate/002_data.sql
 *   # Then paste 002_data.sql into Neon SQL Editor
 */

const SUPABASE_URL = 'https://hgihbaicflhahnhuzmdd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnaWhiYWljZmxoYWhuaHV6bWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxOTE0MzgsImV4cCI6MjA5MTc2NzQzOH0.oDHsUebuyeWHUmI1FYpwjLnmQE_j7MwnCs4pDiRVrdM';

const TABLES = [
  { name: 'universities', columns: ['id','short_name','full_name','city','website','description','logo_url','short_name_en','short_name_be','full_name_en','full_name_be','average_mark','created_at','updated_at'] },
  { name: 'faculties', columns: ['id','university_id','name','code','description','name_en','name_be','created_at','updated_at'] },
  { name: 'institutes', columns: ['id','university_id','name','code','description','created_at','updated_at'] },
  { name: 'specialties', columns: ['id','faculty_id','institute_id','university_id','name','code','degree_type','duration_years','description','created_at','updated_at'] },
  { name: 'admission_stats', columns: ['id','specialty_id','year','budget_places','paid_places','min_score','avg_score','paid_min_score','applications_count','enrolled_count','created_at'] },
  { name: 'vacancies', columns: ['id','title','company','city','category','salary_min','salary_max','salary_currency','experience_required','employment_type','description','source_url','parsed_at','created_at'] },
  { name: 'salary_stats', columns: ['id','category','specialty_name','city','avg_salary','min_salary','max_salary','vacancies_count','demand_level','career_growth_potential','year','month','source','created_at'] },
  { name: 'career_paths', columns: ['id','specialty_category','level_name','level_order','typical_salary_min','typical_salary_max','years_experience','description','created_at'] },
  { name: 'parsing_sessions', columns: ['id','source','category','status','total_pages','current_page','total_found','new_vacancies','duplicates_skipped','started_at','completed_at','error_message','created_at'] },
  { name: 'profession_forecasts', columns: ['id','profession_name','category','demand_level','forecast_year','source','city','description','related_specialties','created_at','updated_at'] },
  { name: 'profession_salaries', columns: ['id','profession_name','search_query','avg_salary','min_salary','max_salary','vacancies_count','city','year','month','source','created_at','updated_at'] },
  { name: 'professions_salary', columns: ['id','profession_name','category','min_salary','max_salary','avg_salary','median_salary','currency','source','region','year','created_at'] },
  { name: 'salary_statistics', columns: ['id','year','month','quarter','region_type','region_name','industry_code','industry_name','industry_category','avg_salary','median_salary','min_salary','max_salary','vacancies_count','employees_count','growth_rate','source','source_url','data_date','notes','created_at','updated_at'] },
];

function escapeValue(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
  return `'${String(val).replace(/'/g, "''")}'`;
}

async function fetchTable(tableName) {
  const url = `${SUPABASE_URL}/rest/v1/${tableName}?select=*&order=created_at`;
  const res = await fetch(url, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    }
  });
  if (!res.ok) {
    console.error(`-- Error fetching ${tableName}: ${res.status} ${res.statusText}`);
    return [];
  }
  return res.json();
}

async function main() {
  console.log('-- ============================================================');
  console.log('-- GradPath Data Migration');
  console.log(`-- Generated: ${new Date().toISOString()}`);
  console.log('-- ============================================================');
  console.log('');

  for (const table of TABLES) {
    console.log(`-- Table: ${table.name}`);
    try {
      const rows = await fetchTable(table.name);
      console.log(`-- Fetched ${rows.length} rows`);
      
      if (rows.length === 0) {
        console.log(`-- No data for ${table.name}`);
        console.log('');
        continue;
      }

      const cols = table.columns.filter(c => rows[0].hasOwnProperty(c));
      
      for (const row of rows) {
        const values = cols.map(c => escapeValue(row[c]));
        console.log(`INSERT INTO ${table.name} (${cols.join(', ')}) VALUES (${values.join(', ')});`);
      }
      console.log('');
    } catch (err) {
      console.error(`-- Error processing ${table.name}: ${err.message}`);
    }
  }

  console.log('-- Done!');
}

main().catch(console.error);
