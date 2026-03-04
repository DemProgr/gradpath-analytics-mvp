-- Миграция для добавления данных БГУ и БГУИР и исправления схемы
-- Выполнить в Supabase SQL Editor

-- 1. Удаляем старые foreign key ограничения, которые мешают использовать текстовые ID
ALTER TABLE public.admission_stats DROP CONSTRAINT IF EXISTS admission_stats_specialty_id_fkey;
ALTER TABLE public.specialties DROP CONSTRAINT IF EXISTS specialties_faculty_id_fkey;
ALTER TABLE public.faculties DROP CONSTRAINT IF EXISTS faculties_university_id_fkey;

-- 2. Изменяем типы колонок на текстовые для связи
ALTER TABLE public.faculties ALTER COLUMN id TYPE TEXT;
ALTER TABLE public.faculties ALTER COLUMN university_id TYPE TEXT;
ALTER TABLE public.specialties ALTER COLUMN id TYPE TEXT;
ALTER TABLE public.specialties ALTER COLUMN faculty_id TYPE TEXT;
ALTER TABLE public.specialties ALTER COLUMN institute_id TYPE TEXT;
ALTER TABLE public.admission_stats ALTER COLUMN specialty_id TYPE TEXT;

-- 2.1 Добавляем колонку university_id в specialties если её нет
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'specialties' AND column_name = 'university_id') THEN
        ALTER TABLE public.specialties ADD COLUMN university_id TEXT;
    END IF;
END $$;

-- 2.2 Добавляем колонку university_id в faculties если её нет
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'faculties' AND column_name = 'university_id') THEN
        ALTER TABLE public.faculties ADD COLUMN university_id TEXT;
    END IF;
END $$;

-- 3. Добавляем университеты БГУ и БГУИР
INSERT INTO public.universities (id, short_name, full_name, city, website) VALUES
('bsu', 'БГУ', 'Белорусский государственный университет', 'Минск', 'https://www.bsu.by'),
('bsuir', 'БГУИР', 'Белорусский государственный университет информатики и радиоэлектроники', 'Минск', 'https://www.bsuir.by')
ON CONFLICT (id) DO NOTHING;

-- 4. Добавляем факультеты БГУ (основные)
INSERT INTO public.faculties (id, university_id, name, code) VALUES
('bsu-1', 'bsu', 'Факультет прикладной математики и информатики', 'ФПМИ'),
('bsu-2', 'bsu', 'Факультет радиофизики и компьютерных технологий', 'ФРКТ'),
('bsu-3', 'bsu', 'Экономический факультет', 'ЭФ'),
('bsu-4', 'bsu', 'Юридический факультет', 'ЮФ'),
('bsu-5', 'bsu', 'Филологический факультет', 'ФилФ'),
('bsu-6', 'bsu', 'Исторический факультет', 'ИстФ'),
('bsu-7', 'bsu', 'Химический факультет', 'ХимФ'),
('bsu-8', 'bsu', 'Физический факультет', 'ФизФ'),
('bsu-9', 'bsu', 'Биологический факультет', 'БиоФ'),
('bsu-10', 'bsu', 'Факультет международных отношений', 'ФМО'),
('bsu-11', 'bsu', 'Факультет социокультурных коммуникаций', 'ФСК'),
('bsu-12', 'bsu', 'Факультет журналистики', 'ФЖ'),
('bsu-13', 'bsu', 'Факультет географии и геоинформатики', 'ФГиГ'),
('bsu-14', 'bsu', 'Факультет философии и социальных наук', 'ФФиСН'),
('bsu-15', 'bsu', 'Военный факультет', 'ВФ'),
('bsu-16', 'bsu', 'Механико-математический факультет', 'ММФ'),
('bsu-i1', 'bsu', 'Институт бизнеса БГУ', 'ИБ'),
('bsu-i2', 'bsu', 'Институт теологии имени святых Мефодия и Кирилла', 'ИТ'),
('bsu-i3', 'bsu', 'Международный государственный экологический институт им. А.Д.Сахарова', 'МГЭИ'),
('bsu-i4', 'bsu', 'Совместный институт БГУ и Даляньского политехнического университета', 'СИБД')
ON CONFLICT (id) DO NOTHING;

-- 5. Добавляем факультеты БГУИР
INSERT INTO public.faculties (id, university_id, name, code) VALUES
('bsuir-1', 'bsuir', 'Факультет компьютерного проектирования', 'ФКП'),
('bsuir-2', 'bsuir', 'Факультет информационных технологий и управления', 'ФИТУ'),
('bsuir-3', 'bsuir', 'Факультет радиотехники и электроники', 'ФРЭ'),
('bsuir-4', 'bsuir', 'Факультет компьютерных систем и сетей', 'ФКСиС'),
('bsuir-5', 'bsuir', 'Факультет информационной безопасности', 'ФИБ'),
('bsuir-6', 'bsuir', 'Инженерно-экономический факультет', 'ИЭФ'),
('bsuir-7', 'bsuir', 'Военный факультет', 'ВФ'),
('bsuir-9', 'bsuir', 'Факультет доуниверситетской подготовки и профессиональной ориентации', 'ФДПиПО'),
('bsuir-i1', 'bsuir', 'Институт информационных технологий', 'ИИТ')
ON CONFLICT (id) DO NOTHING;

-- 6. Добавляем специальности БГУ (основные - ФПМИ)
INSERT INTO public.specialties (id, university_id, name, code, faculty_id) VALUES
('bsu-s1', 'bsu', 'Прикладная математика', '1-31 03 07', 'bsu-1'),
('bsu-s2', 'bsu', 'Прикладная информатика', '1-31 03 08', 'bsu-1'),
('bsu-s3', 'bsu', 'Информатика', '1-31 03 09', 'bsu-1'),
('bsu-s4', 'bsu', 'Кибербезопасность', '1-31 03 10', 'bsu-1'),
('bsu-s5', 'bsu', 'Радиофизика и информационные технологии', '1-31 03 01', 'bsu-2'),
('bsu-s6', 'bsu', 'Кибербезопасность', '1-31 03 02', 'bsu-2'),
('bsu-s7', 'bsu', 'Прикладная информатика', '1-31 03 03', 'bsu-2')
ON CONFLICT (id) DO NOTHING;

-- 7. Добавляем специальности БГУИР
INSERT INTO public.specialties (id, university_id, name, code, faculty_id) VALUES
-- Факультет компьютерного проектирования (ФКП)
('bsuir-s1', 'bsuir', 'Информационные системы и технологии', '1-40 01 01', 'bsuir-1'),
('bsuir-s2', 'bsuir', 'Компьютерная инженерия', '1-40 01 02', 'bsuir-1'),
('bsuir-s3', 'bsuir', 'Программная инженерия', '1-40 01 03', 'bsuir-1'),
('bsuir-s4', 'bsuir', 'Электронные системы и технологии', '1-40 01 04', 'bsuir-1'),
('bsuir-s5', 'bsuir', 'Электронное машиностроение', '1-40 01 05', 'bsuir-1'),
-- Факультет информационных технологий и управления (ФИТУ)
('bsuir-s6', 'bsuir', 'Информационные системы и технологии', '1-40 02 01', 'bsuir-2'),
('bsuir-s7', 'bsuir', 'Искусственный интеллект', '1-40 02 02', 'bsuir-2'),
('bsuir-s8', 'bsuir', 'Киберфизические системы', '1-40 02 03', 'bsuir-2'),
('bsuir-s9', 'bsuir', 'Системы управления информацией', '1-40 02 04', 'bsuir-2'),
('bsuir-s10', 'bsuir', 'Электронные системы и технологии', '1-40 02 05', 'bsuir-2'),
-- Факультет радиотехники и электроники (ФРЭ)
('bsuir-s11', 'bsuir', 'Информационные и управляющие системы физических установок', '1-40 03 01', 'bsuir-3'),
('bsuir-s12', 'bsuir', 'Инженерно-педагогическая деятельность', '1-40 03 02', 'bsuir-3'),
('bsuir-s13', 'bsuir', 'Микро- и наноэлектроника', '1-40 03 03', 'bsuir-3'),
('bsuir-s14', 'bsuir', 'Нанотехнологии и наноматериалы', '1-40 03 04', 'bsuir-3'),
('bsuir-s15', 'bsuir', 'Радиосистемы и радиотехнологии', '1-40 03 05', 'bsuir-3'),
-- Факультет компьютерных систем и сетей (ФКСиС)
('bsuir-s16', 'bsuir', 'Информатика и технологии программирования', '1-40 04 01', 'bsuir-4'),
('bsuir-s17', 'bsuir', 'Компьютерная инженерия', '1-40 04 02', 'bsuir-4'),
('bsuir-s18', 'bsuir', 'Программная инженерия', '1-40 04 03', 'bsuir-4'),
-- Факультет информационной безопасности (ФИБ)
('bsuir-s19', 'bsuir', 'Информационная безопасность', '1-40 05 01', 'bsuir-5'),
('bsuir-s20', 'bsuir', 'Системы и сети инфокоммуникаций', '1-40 05 02', 'bsuir-5'),
('bsuir-s21', 'bsuir', 'Сверхвысокочастотные системы', '1-40 05 03', 'bsuir-5'),
-- Инженерно-экономический факультет (ИЭФ)
('bsuir-s22', 'bsuir', 'Информационные системы и технологии', '1-40 06 01', 'bsuir-6'),
('bsuir-s23', 'bsuir', 'Цифровой маркетинг', '1-40 06 02', 'bsuir-6'),
('bsuir-s24', 'bsuir', 'Электронная экономика', '1-40 06 03', 'bsuir-6'),
-- Военный факультет (ВФ)
('bsuir-s25', 'bsuir', 'Радиосистемы и радиотехнологии', '1-40 07 01', 'bsuir-7'),
('bsuir-s26', 'bsuir', 'Компьютерная инженерия', '1-40 07 02', 'bsuir-7'),
('bsuir-s27', 'bsuir', 'Системы и сети инфокоммуникаций', '1-40 07 03', 'bsuir-7'),
('bsuir-s28', 'bsuir', 'Информационная безопасность', '1-40 07 04', 'bsuir-7')
ON CONFLICT (id) DO NOTHING;

-- 8. Добавляем данные поступления БГУ 2025
DELETE FROM public.admission_stats WHERE specialty_id LIKE 'bsu-s%' AND year = 2025;
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
-- ФПМИ
('bsu-s1', 2025, NULL, NULL, 371, NULL, 358),
('bsu-s2', 2025, NULL, NULL, 391, NULL, 359),
('bsu-s3', 2025, NULL, NULL, 387, NULL, 358),
('bsu-s4', 2025, NULL, NULL, 378, NULL, 341),
-- ФРКТ
('bsu-s5', 2025, NULL, NULL, 346, NULL, 308),
('bsu-s6', 2025, NULL, NULL, 351, NULL, 313),
('bsu-s7', 2025, NULL, NULL, 360, NULL, 309);

-- 9. Добавляем данные поступления БГУИР 2025
DELETE FROM public.admission_stats WHERE specialty_id LIKE 'bsuir-s%' AND year = 2025;
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
-- Факультет компьютерного проектирования (ФКП)
('bsuir-s1', 2025, NULL, NULL, 380, NULL, 326),
('bsuir-s2', 2025, NULL, NULL, 367, NULL, 308),
('bsuir-s3', 2025, NULL, NULL, 385, NULL, 345),
('bsuir-s4', 2025, NULL, NULL, 348, NULL, 296),
('bsuir-s5', 2025, NULL, NULL, 334, NULL, 295),
-- Факультет информационных технологий и управления (ФИТУ)
('bsuir-s6', 2025, NULL, NULL, 392, NULL, 332),
('bsuir-s7', 2025, NULL, NULL, 380, NULL, 347),
('bsuir-s8', 2025, NULL, NULL, 358, NULL, 318),
('bsuir-s9', 2025, NULL, NULL, 376, NULL, 323),
('bsuir-s10', 2025, NULL, NULL, 368, NULL, NULL),
-- Факультет радиотехники и электроники (ФРЭ)
('bsuir-s11', 2025, NULL, NULL, 330, NULL, 291),
('bsuir-s12', 2025, NULL, NULL, 260, NULL, NULL),
('bsuir-s13', 2025, NULL, NULL, 284, NULL, NULL),
('bsuir-s14', 2025, NULL, NULL, 313, NULL, NULL),
('bsuir-s15', 2025, NULL, NULL, 279, NULL, 280),
-- Факультет компьютерных систем и сетей (ФКСиС)
('bsuir-s16', 2025, NULL, NULL, 388, NULL, 339),
('bsuir-s17', 2025, NULL, NULL, 366, NULL, 301),
('bsuir-s18', 2025, NULL, NULL, 394, NULL, 362),
-- Факультет информационной безопасности (ФИБ)
('bsuir-s19', 2025, NULL, NULL, 366, NULL, 314),
('bsuir-s20', 2025, NULL, NULL, 340, NULL, 297),
('bsuir-s21', 2025, NULL, NULL, 325, NULL, 294),
-- Инженерно-экономический факультет (ИЭФ)
('bsuir-s22', 2025, NULL, NULL, 372, NULL, 316),
('bsuir-s23', 2025, NULL, NULL, 390, NULL, 315),
('bsuir-s24', 2025, NULL, NULL, 394, NULL, 328),
-- Военный факультет (ВФ)
('bsuir-s25', 2025, NULL, NULL, 267, NULL, NULL),
('bsuir-s26', 2025, NULL, NULL, 342, NULL, NULL),
('bsuir-s27', 2025, NULL, NULL, 302, NULL, NULL),
('bsuir-s28', 2025, NULL, NULL, 333, NULL, NULL);

-- 10. Добавляем данные поступления БГУИР 2024
DELETE FROM public.admission_stats WHERE specialty_id LIKE 'bsuir-s%' AND year = 2024;
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
-- Факультет компьютерного проектирования (ФКП)
('bsuir-s1', 2024, 151, NULL, 378, NULL, 327),
('bsuir-s2', 2024, 112, NULL, 364, NULL, 291),
('bsuir-s3', 2024, NULL, NULL, 393, NULL, 313),
('bsuir-s4', 2024, 139, NULL, 336, NULL, 255),
('bsuir-s5', 2024, 164, NULL, 387, NULL, 302),
-- Факультет информационных технологий и управления (ФИТУ)
('bsuir-s6', 2024, NULL, NULL, 366, NULL, 298),
('bsuir-s9', 2024, 179, NULL, 382, NULL, 340),
('bsuir-s10', 2024, NULL, NULL, 358, NULL, 300),
-- Факультет радиотехники и электроники (ФРЭ)
('bsuir-s11', 2024, 182, NULL, 382, NULL, 344),
('bsuir-s12', 2024, 177, NULL, 376, NULL, 312),
-- Факультет компьютерных систем и сетей (ФКСиС)
('bsuir-s16', 2024, 182, NULL, 382, NULL, 344),
('bsuir-s17', 2024, 182, NULL, 382, NULL, 344),
('bsuir-s18', 2024, 182, NULL, 382, NULL, 344),
-- Факультет информационной безопасности (ФИБ)
('bsuir-s19', 2024, 110, NULL, 238, NULL, 179),
('bsuir-s20', 2024, NULL, NULL, 329, NULL, 258),
-- Инженерно-экономический факультет (ИЭФ)
('bsuir-s22', 2024, 162, NULL, 366, NULL, 289),
('bsuir-s24', 2024, 162, NULL, 395, NULL, 359);

-- Проверка данных
SELECT 'Universities:' as info, COUNT(*) as count FROM public.universities
UNION ALL
SELECT 'Faculties:', COUNT(*) FROM public.faculties
UNION ALL
SELECT 'Specialties:', COUNT(*) FROM public.specialties
UNION ALL
SELECT 'Admission Stats 2025:', COUNT(*) FROM public.admission_stats WHERE year = 2025
UNION ALL
SELECT 'Admission Stats BSUIR:', COUNT(*) FROM public.admission_stats WHERE specialty_id LIKE 'bsuir-%';
