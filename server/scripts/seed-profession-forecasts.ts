import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function main() {
  const sql = neon(process.env.DATABASE_URL!);

  const existing = await sql`SELECT COUNT(*)::int as count FROM profession_forecasts`;
  if (existing[0]?.count > 0) {
    console.log('profession_forecasts table already has data, skipping seed');
    process.exit(0);
  }

  await sql(`
    INSERT INTO profession_forecasts (profession_name, category, demand_level, forecast_year, source, city, description, related_specialties) VALUES
    ('Водитель автомобиля', 'worker', 'high', 2026, 'myfin.by', 'Минск', NULL, '[]'::jsonb),
    ('Каменщик', 'worker', 'high', 2026, 'myfin.by', 'Минск', NULL, '[]'::jsonb),
    ('Маляр', 'worker', 'high', 2026, 'myfin.by', 'Минск', NULL, '[]'::jsonb),
    ('Штукатур', 'worker', 'high', 2026, 'myfin.by', 'Минск', NULL, '[]'::jsonb),
    ('Монтажник строительных конструкций', 'worker', 'high', 2026, 'myfin.by', 'Минск', NULL, '[]'::jsonb),
    ('Официант', 'worker', 'high', 2026, 'myfin.by', 'Минск', NULL, '[]'::jsonb),
    ('Повар', 'worker', 'high', 2026, 'myfin.by', 'Минск', NULL, '[]'::jsonb),
    ('Продавец', 'worker', 'high', 2026, 'myfin.by', 'Минск', NULL, '[]'::jsonb),
    ('Электромонтер', 'worker', 'high', 2026, 'myfin.by', 'Минск', NULL, '[]'::jsonb),
    ('Бухгалтер', 'employee', 'high', 2026, 'myfin.by', 'Минск', NULL, '["Бухгалтерский учет, анализ и аудит", "Финансы и кредит"]'::jsonb),
    ('Воспитатель', 'employee', 'high', 2026, 'myfin.by', 'Минск', NULL, '["Дошкольное образование", "Педагогика"]'::jsonb),
    ('Врач-специалист', 'employee', 'high', 2026, 'myfin.by', 'Минск', NULL, '["Лечебное дело", "Педиатрия", "Стоматология"]'::jsonb),
    ('Государственный налоговый инспектор', 'employee', 'high', 2026, 'myfin.by', 'Минск', NULL, '["Государственное управление", "Правоведение"]'::jsonb),
    ('Менеджер по продажам', 'employee', 'high', 2026, 'myfin.by', 'Минск', NULL, '["Менеджмент", "Маркетинг", "Коммерческая деятельность"]'::jsonb),
    ('Специалист по кадрам', 'employee', 'high', 2026, 'myfin.by', 'Минск', NULL, '["Управление персоналом", "Менеджмент"]'::jsonb),
    ('Специалист по оказанию банковских услуг', 'employee', 'high', 2026, 'myfin.by', 'Минск', NULL, '["Финансы и кредит", "Банковское дело"]'::jsonb),
    ('Учитель', 'employee', 'high', 2026, 'myfin.by', 'Минск', NULL, '["Педагогика", "Начальное образование", "Дошкольное образование"]'::jsonb),
    ('Фельдшер', 'employee', 'high', 2026, 'myfin.by', 'Минск', NULL, '["Медицинское дело", "Лечебное дело"]'::jsonb),
    ('Юрист', 'employee', 'high', 2026, 'myfin.by', 'Минск', NULL, '["Правоведение", "Международное право"]'::jsonb),
    ('Визажист', 'worker', 'low', 2026, 'myfin.by', 'Минск', NULL, '[]'::jsonb),
    ('Вязальщица', 'worker', 'low', 2026, 'myfin.by', 'Минск', NULL, '[]'::jsonb),
    ('Кузнец штамповки', 'worker', 'low', 2026, 'myfin.by', 'Минск', NULL, '[]'::jsonb),
    ('Настройщик инструментов', 'worker', 'low', 2026, 'myfin.by', 'Минск', NULL, '[]'::jsonb),
    ('Обойщик мебели', 'worker', 'low', 2026, 'myfin.by', 'Минск', NULL, '[]'::jsonb),
    ('Печатник', 'worker', 'low', 2026, 'myfin.by', 'Минск', NULL, '[]'::jsonb),
    ('Телеграфист', 'worker', 'low', 2026, 'myfin.by', 'Минск', NULL, '[]'::jsonb),
    ('Ткач', 'worker', 'low', 2026, 'myfin.by', 'Минск', NULL, '[]'::jsonb),
    ('Фотограф', 'worker', 'low', 2026, 'myfin.by', 'Минск', NULL, '[]'::jsonb),
    ('Дизайнер', 'employee', 'low', 2026, 'myfin.by', 'Минск', NULL, '["Дизайн", "Архитектура"]'::jsonb),
    ('Зубной техник', 'employee', 'low', 2026, 'myfin.by', 'Минск', NULL, '[]'::jsonb),
    ('Тестировщик программного обеспечения', 'employee', 'low', 2026, 'myfin.by', 'Минск', NULL, '["Программное обеспечение", "Информатика"]'::jsonb),
    ('Культорганизатор', 'employee', 'low', 2026, 'myfin.by', 'Минск', NULL, '[]'::jsonb),
    ('Художник', 'employee', 'low', 2026, 'myfin.by', 'Минск', NULL, '[]'::jsonb),
    ('Эколог', 'employee', 'low', 2026, 'myfin.by', 'Минск', NULL, '["Экология", "Природоохранная деятельность"]'::jsonb),
    ('Экскурсовод', 'employee', 'low', 2026, 'myfin.by', 'Минск', NULL, '[]'::jsonb),
    ('Бармен', 'worker', 'high', 2026, 'neg.by', 'Минск', NULL, '[]'::jsonb),
    ('Бариста', 'worker', 'high', 2026, 'neg.by', 'Минск', NULL, '[]'::jsonb),
    ('Монтажник сантехсистем и оборудования', 'worker', 'high', 2026, 'neg.by', 'Минск', NULL, '[]'::jsonb),
    ('Наладчик станков с программным управлением', 'worker', 'high', 2026, 'neg.by', 'Минск', NULL, '[]'::jsonb),
    ('Облицовщик-плиточник', 'worker', 'high', 2026, 'neg.by', 'Минск', NULL, '[]'::jsonb),
    ('Контролер-кассир', 'worker', 'high', 2026, 'neg.by', 'Минск', NULL, '[]'::jsonb),
    ('Кондитер', 'worker', 'high', 2026, 'neg.by', 'Минск', NULL, '[]'::jsonb),
    ('Слесарь механосборочных работ', 'worker', 'high', 2026, 'neg.by', 'Минск', NULL, '[]'::jsonb),
    ('Слесарь по ремонту автомобилей', 'worker', 'high', 2026, 'neg.by', 'Минск', NULL, '[]'::jsonb),
    ('Слесарь-ремонтник', 'worker', 'high', 2026, 'neg.by', 'Минск', NULL, '[]'::jsonb),
    ('Слесарь-сантехник', 'worker', 'high', 2026, 'neg.by', 'Минск', NULL, '[]'::jsonb),
    ('Токарь', 'worker', 'high', 2026, 'neg.by', 'Минск', NULL, '[]'::jsonb),
    ('Фрезеровщик', 'worker', 'high', 2026, 'neg.by', 'Минск', NULL, '[]'::jsonb),
    ('Тракторист', 'worker', 'high', 2026, 'neg.by', 'Минск', NULL, '[]'::jsonb),
    ('Электрогазосварщик', 'worker', 'high', 2026, 'neg.by', 'Минск', NULL, '[]'::jsonb),
    ('Инженер', 'employee', 'high', 2026, 'neg.by', 'Минск', NULL, '["Инженерные науки", "Машиностроение", "Электроника"]'::jsonb),
    ('Маркетолог', 'employee', 'high', 2026, 'neg.by', 'Минск', NULL, '["Маркетинг", "Менеджмент", "Экономика"]'::jsonb),
    ('Медсестра', 'employee', 'high', 2026, 'neg.by', 'Минск', NULL, '["Медицинское дело", "Лечебное дело"]'::jsonb),
    ('Педагог дополнительного образования', 'employee', 'high', 2026, 'neg.by', 'Минск', NULL, '["Педагогика", "Дополнительное образование"]'::jsonb),
    ('Педагог-психолог', 'employee', 'high', 2026, 'neg.by', 'Минск', NULL, '["Психология", "Педагогика"]'::jsonb),
    ('Экономист', 'employee', 'high', 2026, 'neg.by', 'Минск', NULL, '["Экономика", "Финансы и кредит", "Мировая экономика"]'::jsonb),
    ('Косметик', 'worker', 'low', 2026, 'neg.by', 'Минск', NULL, '[]'::jsonb),
    ('Закройщик', 'worker', 'low', 2026, 'neg.by', 'Минск', NULL, '[]'::jsonb),
    ('Кузнец', 'worker', 'low', 2026, 'neg.by', 'Минск', NULL, '[]'::jsonb),
    ('Радиомеханик', 'worker', 'low', 2026, 'neg.by', 'Минск', NULL, '[]'::jsonb),
    ('Модельер-конструктор', 'employee', 'low', 2026, 'neg.by', 'Минск', NULL, '[]'::jsonb),
    ('Корреспондент', 'employee', 'low', 2026, 'neg.by', 'Минск', NULL, '[]'::jsonb),
    ('Риелтор', 'employee', 'low', 2026, 'neg.by', 'Минск', NULL, '[]'::jsonb),
    ('Секретарь-референт', 'employee', 'low', 2026, 'neg.by', 'Минск', NULL, '[]'::jsonb),
    ('Техник-программист', 'employee', 'low', 2026, 'neg.by', 'Минск', NULL, '["Программное обеспечение", "Информатика"]'::jsonb),
    ('Программист', 'specialist', 'high', 2026, 'kudapostupat.by', 'Беларусь', 'Нужны не только в IT-компаниях, но и в традиционных отраслях для повышения эффективности', '["Программное обеспечение информационных технологий", "Информатика", "Прикладная информатика"]'::jsonb),
    ('Специалист по веб-порталам', 'specialist', 'high', 2026, 'kudapostupat.by', 'Беларусь', NULL, '[]'::jsonb),
    ('Специалист технической поддержки', 'specialist', 'high', 2026, 'kudapostupat.by', 'Беларусь', NULL, '[]'::jsonb),
    ('Станочник', 'worker', 'high', 2026, 'kudapostupat.by', 'Беларусь', 'Квалифицированные рабочие для работы на сложном оборудовании', '[]'::jsonb),
    ('Наладчик', 'worker', 'high', 2026, 'kudapostupat.by', 'Беларусь', NULL, '[]'::jsonb),
    ('Слесарь-сборщик', 'worker', 'high', 2026, 'kudapostupat.by', 'Беларусь', NULL, '[]'::jsonb),
    ('Электромеханик', 'worker', 'high', 2026, 'kudapostupat.by', 'Беларусь', NULL, '[]'::jsonb),
    ('Инженер-технолог', 'specialist', 'high', 2026, 'kudapostupat.by', 'Беларусь', 'Для обеспечения технологического прорыва', '["Технология машиностроения", "Материаловедение"]'::jsonb),
    ('Инженер по контролю качества', 'specialist', 'high', 2026, 'kudapostupat.by', 'Беларусь', NULL, '[]'::jsonb),
    ('Инженер-строитель', 'specialist', 'high', 2026, 'kudapostupat.by', 'Беларусь', NULL, '["Промышленное и гражданское строительство", "Архитектура"]'::jsonb),
    ('Инженер-механик', 'specialist', 'high', 2026, 'kudapostupat.by', 'Беларусь', NULL, '[]'::jsonb),
    ('Бетонщик', 'worker', 'high', 2026, 'kudapostupat.by', 'Беларусь', NULL, '[]'::jsonb),
    ('Сварщик', 'worker', 'high', 2026, 'kudapostupat.by', 'Беларусь', NULL, '[]'::jsonb),
    ('Электромонтажник', 'worker', 'high', 2026, 'kudapostupat.by', 'Беларусь', NULL, '[]'::jsonb),
    ('Специалист по уходу', 'specialist', 'high', 2026, 'kudapostupat.by', 'Беларусь', 'Стабильный спрос из-за старения населения', '["Медицинское дело", "Социальная работа"]'::jsonb),
    ('Врач', 'specialist', 'high', 2026, 'kudapostupat.by', 'Беларусь', NULL, '["Лечебное дело", "Педиатрия", "Стоматология"]'::jsonb),
    ('Кассир', 'worker', 'medium', 2026, 'kudapostupat.by', 'Беларусь', NULL, '[]'::jsonb),
    ('Педагог', 'specialist', 'high', 2026, 'kudapostupat.by', 'Беларусь', 'Без качественного образования невозможно подготовить кадры', '["Педагогика", "Дошкольное образование", "Начальное образование"]'::jsonb)
  `);

  console.log('Seeded profession_forecasts table');
  process.exit(0);
}

main().catch((err: any) => { console.error(err); process.exit(1); });
