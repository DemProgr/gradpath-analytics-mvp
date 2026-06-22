import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function main() {
  const sql = neon(process.env.DATABASE_URL!);

  const existing = await sql`SELECT COUNT(*)::int as count FROM events`;
  if (existing[0]?.count > 0) {
    console.log('events table already has data, skipping seed');
    process.exit(0);
  }

  await sql(`
    INSERT INTO events (title, organizer, organizer_type, date, end_date, time, city, format, type, description, link, tags) VALUES
    ('День карьеры БГУИР', 'БГУИР', 'university', '2026-09-15', NULL, '10:00', 'Минск', 'offline', 'career_fair',
     'Ежегодная ярмарка вакансий БГУИР. Ведущие IT-компании, мастер-классы и карьерные консультации.',
     'https://bsuir.by', ARRAY['IT', 'Карьера', 'Ярмарка вакансий']),

    ('EPAM Open Day', 'EPAM Systems', 'company', '2026-10-05', NULL, '14:00', 'Минск', 'offline', 'open_day',
     'День открытых дверей EPAM. Знакомство с компанией, экскурсия по офису, Q&A с разработчиками.',
     'https://epam.com', ARRAY['IT', 'Open Day', 'EPAM']),

    ('IBA Tech Meetup', 'IBA Group', 'company', '2026-10-20', NULL, '18:30', 'Минск', 'hybrid', 'meetup',
     'Технический митап от IBA. Доклады про Java, Cloud, AI. Нетворкинг и пицца.',
     'https://iba.by', ARRAY['Java', 'Cloud', 'AI', 'Meetup']),

    ('A1 Career Day', 'A1', 'company', '2026-11-01', NULL, '11:00', 'Минск', 'offline', 'career_fair',
     'Карьерный день A1. Стажировки, вакансии, встречи с командами телеком-оператора.',
     'https://a1.by', ARRAY['Телеком', 'Карьера', 'Стажировки']),

    ('Data Science Meetup', 'AIESEC', 'student_org', '2026-11-15', NULL, '19:00', 'Минск', 'online', 'meetup',
     'Онлайн-митап по Data Science. Спикеры из топовых IT-компаний делятся опытом.',
     'https://aiesec.by', ARRAY['Data Science', 'ML', 'Online']),

    ('BEST Career Fair', 'BEST Minsk', 'student_org', '2026-11-25', '2026-11-26', '10:00', 'Минск', 'offline', 'career_fair',
     'Крупнейшая ярмарка вакансий для студентов технических специальностей. 30+ компаний.',
     'https://best.by', ARRAY['Карьера', 'Ярмарка', 'Техника']),

    ('Belhard IT Weekend', 'Belhard', 'company', '2026-12-03', '2026-12-04', '09:00', 'Минск', 'offline', 'workshop',
     'Двухдневный воркшоп по веб-разработке. React, Node.js, базы данных. Практика с менторами.',
     'https://belhard.by', ARRAY['React', 'Node.js', 'Workshop']),

    ('День карьеры БГУ', 'БГУ', 'university', '2026-12-10', NULL, '11:00', 'Минск', 'offline', 'career_fair',
     'Ярмарка вакансий БГУ. Компании из IT, финансов, консалтинга и производства.',
     'https://bsu.by', ARRAY['Карьера', 'Ярмарка', 'БГУ']),

    ('Enactus Startup Pitch', 'Enactus Belarus', 'student_org', '2026-12-18', NULL, '15:00', 'Минск', 'hybrid', 'other',
     'Питч-сессия студенческих стартапов. Призы, инвестиции, менторство от экспертов.',
     'https://enactus.by', ARRAY['Стартап', 'Питч', 'Предпринимательство']),

    ('Wargaming Tech Talk', 'Wargaming', 'company', '2027-01-20', NULL, '18:00', 'Минск', 'offline', 'lecture',
     'Техническая лекция от Wargaming. Архитектура игровых движков, C++, оптимизация.',
     'https://wargaming.com', ARRAY['C++', 'GameDev', 'Лекция'])
  `);

  console.log('Seeded 10 events');
  process.exit(0);
}

main().catch((err: any) => { console.error(err); process.exit(1); });
