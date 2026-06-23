import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function main() {
  const sql = neon(process.env.DATABASE_URL!);

  const existing = await sql`SELECT COUNT(*)::int as count FROM salary_stats`;
  if (existing[0]?.count > 0) {
    console.log('salary_stats table already has data, skipping seed');
    process.exit(0);
  }

  await sql(`
    INSERT INTO salary_stats (category, avg_salary, min_salary, max_salary, demand_level, year, source) VALUES
    ('ИТ', 3000, 1200, 8000, 'high', 2026, 'professions_salary'),
    ('Финансы', 1800, 800, 6000, 'medium', 2026, 'professions_salary'),
    ('Маркетинг', 1400, 700, 4000, 'medium', 2026, 'professions_salary'),
    ('Инженерия', 1600, 800, 5000, 'medium', 2026, 'professions_salary'),
    ('Медицина', 1700, 600, 4500, 'high', 2026, 'professions_salary'),
    ('Юриспруденция', 1800, 600, 8000, 'low', 2026, 'professions_salary'),
    ('Образование', 1000, 600, 2200, 'medium', 2026, 'professions_salary'),
    ('Дизайн', 1600, 700, 5500, 'medium', 2026, 'professions_salary'),
    ('Архитектура', 1800, 1000, 5000, 'medium', 2026, 'professions_salary'),
    ('Медиа', 1300, 700, 3000, 'low', 2026, 'professions_salary'),
    ('Продажи', 1500, 700, 5000, 'high', 2026, 'professions_salary'),
    ('Строительство', 1700, 1000, 3500, 'high', 2026, 'professions_salary'),
    ('Транспорт', 1600, 1000, 3000, 'medium', 2026, 'professions_salary'),
    ('Торговля', 1200, 700, 2500, 'high', 2026, 'professions_salary'),
    ('HR', 1400, 800, 2800, 'medium', 2026, 'professions_salary')
  `);

  console.log('Seeded salary_stats table with 15 categories');
  process.exit(0);
}

main().catch((err: any) => { console.error(err); process.exit(1); });
