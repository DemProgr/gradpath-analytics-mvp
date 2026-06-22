import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function main() {
  const sql = neon(process.env.DATABASE_URL!);

  const existing = await sql`SELECT COUNT(*)::int as count FROM internships`;
  if (existing[0]?.count > 0) {
    console.log('internships table already has data, skipping seed');
    process.exit(0);
  }

  await sql(`
    INSERT INTO internships (title, company, city, salary_min, salary_max, duration, type, category, requirements, link, posted_at) VALUES
    ('Frontend-разработчик (стажировка)', 'Wargaming', 'Минск', 800, 1200, '3-6 месяцев', 'paid', 'ИТ', ARRAY['JavaScript', 'React', 'HTML/CSS', 'Английский B1+'], 'https://wargaming.com', now() - interval '2 days'),
    ('Python Developer Intern', 'EPAM Systems', 'Минск', 600, 1000, '3 месяца', 'paid', 'ИТ', ARRAY['Python', 'SQL', 'Git', 'Английский B2'], 'https://epam.com', now() - interval '3 days'),
    ('Маркетинг-ассистент', 'Белтелеком', 'Минск', 500, null, '6 месяцев', 'paid', 'Маркетинг', ARRAY['SMM', 'Копирайтинг', 'Photoshop'], 'https://beltelecom.by', now() - interval '7 days'),
    ('Стажер-бухгалтер', 'Делойт', 'Минск', 400, 600, '6 месяцев', 'paid', 'Финансы', ARRAY['1C', 'Excel', 'Английский B2'], 'https://deloitte.com', now() - interval '5 days'),
    ('QA Engineer (стажировка)', 'ISsoft', 'Минск', 500, 800, '2-4 месяца', 'paid', 'ИТ', ARRAY['Тестирование', 'SQL', 'Техническая документация'], 'https://issoft.by', now() - interval '1 day'),
    ('Помощник юриста', 'Ревега', 'Минск', 300, 500, '6 месяцев', 'paid', 'Юриспруденция', ARRAY['Высшее юридическое (студент 4-5 курс)', 'MS Office'], 'https://revega.by', now() - interval '4 days'),
    ('Data Science стажер', 'AITer', 'Минск', 700, 1200, '3-6 месяцев', 'paid', 'ИТ', ARRAY['Python', 'Machine Learning', 'TensorFlow', 'Английский B2'], 'https://aiter.io', now() - interval '6 days'),
    ('Стажер-инженер', 'МТЗ', 'Минск', 400, null, '6 месяцев', 'paid', 'Инженерия', ARRAY['Техническое образование', 'AutoCAD'], 'https://mtz.by', now() - interval '7 days'),
    ('Java Intern', 'IBA Group', 'Минск', 500, 800, '3 месяца', 'paid', 'ИТ', ARRAY['Java Core', 'SQL', 'Spring Boot', 'Английский B1'], 'https://iba.by', now() - interval '1 day'),
    ('UI/UX стажер', 'Andersen', 'Минск', 400, 700, '4 месяца', 'paid', 'ИТ', ARRAY['Figma', 'UI/UX', 'Прототипирование'], 'https://andersenlab.com', now() - interval '3 days'),
    ('Стажер отдела продаж', 'МТС', 'Минск', 500, null, '3 месяца', 'paid', 'Продажи', ARRAY['Навыки переговоров', 'Excel', 'CRM системы'], 'https://mts.by', now() - interval '8 days'),
    ('DevOps стажер', 'Wargaming', 'Минск', 900, 1300, '6 месяцев', 'paid', 'ИТ', ARRAY['Docker', 'Kubernetes', 'CI/CD', 'Linux'], 'https://wargaming.com', now() - interval '4 days')
  `);

  console.log('Seeded 12 internships');
  process.exit(0);
}

main().catch((err: any) => { console.error(err); process.exit(1); });
