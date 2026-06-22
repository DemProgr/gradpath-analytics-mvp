# Миграция из Supabase в Neon — Пошаговая инструкция

## Шаг 1: Создайте таблицы в Neon

1. Откройте **Neon Console**: https://console.neon.tech
2. Выберите проект → **SQL Editor**
3. Скопируйте содержимое `server/migrate/001_create_tables.sql` и вставьте в SQL Editor
4. Нажмите **Run** — все таблицы будут созданы

## Шаг 2: Экспортируйте данные из Supabase

### Вариант A: Через Supabase SQL Editor (рекомендуется)

1. Откройте **Supabase Dashboard**: https://supabase.com/dashboard
2. Выберите проект → **SQL Editor**
3. Для каждой таблицы выполните запрос и скопируйте результат:

```sql
-- Университеты
SELECT * FROM universities;

-- Факультеты
SELECT * FROM faculties;

-- Специальности
SELECT * FROM specialties;

-- Статистика поступлений
SELECT * FROM admission_stats;

-- Вакансии (может быть много)
SELECT * FROM vacancies;

-- Зарплатная статистика
SELECT * FROM salary_stats;

-- Карьерные траектории
SELECT * FROM career_paths;

-- Сессии парсинга
SELECT * FROM parsing_sessions;

-- Прогнозы профессий
SELECT * FROM profession_forecasts;

-- Зарплаты профессий
SELECT * FROM profession_salaries;

-- Профессии зарплаты
SELECT * FROM professions_salary;

-- Статистика зарплат
SELECT * FROM salary_statistics;
```

4. Каждый результат экспортируйте в **CSV** (кнопка Download)

### Вариант B: Через Supabase REST API

```bash
# Установите переменные
SUPABASE_URL="https://hgihbaicflhahnhuzmdd.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnaWhiYWljZmxoYWhuaHV6bWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxOTE0MzgsImV4cCI6MjA5MTc2NzQzOH0.oDHsUebuyeWHUmI1FYpwjLnmQE_j7MwnCs4pDiRVrdM"

# Экспорт каждой таблицы
for table in universities faculties specialties admission_stats vacancies salary_stats career_paths parsing_sessions profession_forecasts profession_salaries professions_salary salary_statistics; do
  curl -s "$SUPABASE_URL/rest/v1/$table?select=*" \
    -H "apikey: $SUPABASE_KEY" \
    -H "Authorization: Bearer $SUPABASE_KEY" \
    > "$table.json"
  echo "Exported $table"
done
```

## Шаг 3: Импортируйте данные в Neon

### Вариант A: Через Neon SQL Editor (рекомендуется)

В SQL Editor Neon вставьте SQL-инструкции INSERT для каждой таблицы.
Формат:

```sql
INSERT INTO universities (id, short_name, full_name, city, website, description, logo_url, short_name_en, short_name_be, full_name_en, full_name_be, created_at, updated_at)
VALUES
  ('uuid-1', 'БГУ', 'Белорусский государственный университет', 'Минск', 'https://bsu.by', NULL, NULL, 'BSU', 'БДУ', 'Belarusian State University', 'Беларускі дзяржаўны ўніверсітэт', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ...;
```

### Вариант B: Через COPY (для больших таблиц)

1. Экспортируйте данные из Supabase в CSV (см. Шаг 2)
2. В Neon SQL Editor используйте:

```sql
COPY vacancies(title, company, city, category, salary_min, salary_max, salary_currency, experience_required, employment_type, description, source_url, parsed_at, created_at)
FROM '/path/to/vacancies.csv'
DELIMITER ','
CSV HEADER;
```

Примечание: COPY работает с локальных файлов. Для удалённого доступа используйте `psql` или API.

### Вариант C: Через Neon REST API (Data API)

Если у вас есть JWT токен для Neon:

```bash
NEON_API="https://ep-divine-forest-asi2eii5.apirest.c-4.eu-central-1.aws.neon.tech/neondb/rest/v1"
NEON_TOKEN="your-jwt-token"

# Импорт данных
curl -X POST "$NEON_API/universities" \
  -H "Authorization: Bearer $NEON_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d @universities.json
```

## Шаг 4: Обновите server/.env

Замените заглушку на реальный URL подключения:

```env
DATABASE_URL=postgresql://user:password@ep-divine-forest-asi2eii5.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

Найдите URL в Neon Console → **Dashboard** → **Connection string** → скопируйте **Pooled** версию.

## Шаг 5: Проверьте работу

```bash
# Запустите сервер
cd server && npx tsx src/index.ts

# Проверьте API
curl http://localhost:3001/api/universities
curl http://localhost:3001/api/vacancies/count
curl http://localhost:3001/api/admission-stats
```

## Важные замечания

1. **UUID vs TEXT**: Таблицы `faculties`, `specialties`, `career_paths` используют TEXT PRIMARY KEY (не UUID). Это связано с тем, что в миграциях ID были изменены на текстовые (например, `'bsu'`, `'bsu-1'`).

2. **Порядок импорта**: Сначала импортируйте `universities`, затем `faculties`, `specialties`, `admission_stats` (из-за зависимостей).

3. **Большие таблицы**: `vacancies` может содержать тысячи записей. Используйте batch INSERT или COPY.

4. **Auth**: Таблица `users` в Neon используется нашим кастомным JWT auth (не Supabase auth). Нужно будет создать первого admin-пользователя вручную.
