-- Простая миграция для добавления данных поступления БГУ и БГУИР
-- Выполнить в Supabase SQL Editor

-- Проверим текущую структуру таблиц
SELECT '=== Текущая структура ===' as info;
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'admission_stats' ORDER BY ordinal_position;

-- Добавляем колонку paid_min_score если её нет
ALTER TABLE public.admission_stats ADD COLUMN IF NOT EXISTS paid_min_score NUMERIC(5,2);

-- Добавляем университеты
INSERT INTO public.universities (id, short_name, full_name, city, website) VALUES
('bsu', 'БГУ', 'Белорусский государственный университет', 'Минск', 'https://www.bsu.by'),
('bsuir', 'БГУИР', 'Белорусский государственный университет информатики и радиоэлектроники', 'Минск', 'https://www.bsuir.by')
ON CONFLICT (id) DO NOTHING;

-- Добавляем факультеты БГУ
INSERT INTO public.faculties (id, university_id, name, code) VALUES
('bsu-1', 'bsu', 'Факультет прикладной математики и информатики', 'ФПМИ'),
('bsu-2', 'bsu', 'Факультет радиофизики и компьютерных технологий', 'ФРКТ')
ON CONFLICT (id) DO NOTHING;

-- Добавляем факультеты БГУИР
INSERT INTO public.faculties (id, university_id, name, code) VALUES
('bsuir-1', 'bsuir', 'Факультет компьютерного проектирования', 'ФКП'),
('bsuir-2', 'bsuir', 'Факультет информационных технологий и управления', 'ФИТУ'),
('bsuir-3', 'bsuir', 'Факультет радиотехники и электроники', 'ФРЭ'),
('bsuir-4', 'bsuir', 'Факультет компьютерных систем и сетей', 'ФКСиС'),
('bsuir-5', 'bsuir', 'Факультет информационной безопасности', 'ФИБ'),
('bsuir-6', 'bsuir', 'Инженерно-экономический факультет', 'ИЭФ'),
('bsuir-7', 'bsuir', 'Военный факультет', 'ВФ')
ON CONFLICT (id) DO NOTHING;

-- Добавляем специальности БГУ
INSERT INTO public.specialties (id, name, code, faculty_id) VALUES
('bsu-s1', 'Прикладная математика', '1-31 03 07', 'bsu-1'),
('bsu-s2', 'Прикладная информатика', '1-31 03 08', 'bsu-1'),
('bsu-s3', 'Информатика', '1-31 03 09', 'bsu-1'),
('bsu-s4', 'Кибербезопасность', '1-31 03 10', 'bsu-1'),
('bsu-s5', 'Радиофизика и информационные технологии', '1-31 03 01', 'bsu-2'),
('bsu-s6', 'Кибербезопасность', '1-31 03 02', 'bsu-2'),
('bsu-s7', 'Прикладная информатика', '1-31 03 03', 'bsu-2')
ON CONFLICT (id) DO NOTHING;

-- Добавляем специальности БГУИР
INSERT INTO public.specialties (id, name, code, faculty_id) VALUES
-- Факультет компьютерного проектирования
('bsuir-s1', 'Информационные системы и технологии', '1-40 01 01', 'bsuir-1'),
('bsuir-s2', 'Компьютерная инженерия', '1-40 01 02', 'bsuir-1'),
('bsuir-s3', 'Программная инженерия', '1-40 01 03', 'bsuir-1'),
('bsuir-s4', 'Электронные системы и технологии', '1-40 01 04', 'bsuir-1'),
('bsuir-s5', 'Электронное машиностроение', '1-40 01 05', 'bsuir-1'),
-- Факультет информационных технологий и управления
('bsuir-s6', 'Информационные системы и технологии', '1-40 02 01', 'bsuir-2'),
('bsuir-s7', 'Искусственный интеллект', '1-40 02 02', 'bsuir-2'),
('bsuir-s8', 'Киберфизические системы', '1-40 02 03', 'bsuir-2'),
('bsuir-s9', 'Системы управления информацией', '1-40 02 04', 'bsuir-2'),
('bsuir-s10', 'Электронные системы и технологии', '1-40 02 05', 'bsuir-2'),
-- Факультет радиотехники и электроники
('bsuir-s11', 'Информационные и управляющие системы физических установок', '1-40 03 01', 'bsuir-3'),
('bsuir-s12', 'Инженерно-педагогическая деятельность', '1-40 03 02', 'bsuir-3'),
('bsuir-s13', 'Микро- и наноэлектроника', '1-40 03 03', 'bsuir-3'),
('bsuir-s14', 'Нанотехнологии и наноматериалы', '1-40 03 04', 'bsuir-3'),
('bsuir-s15', 'Радиосистемы и радиотехнологии', '1-40 03 05', 'bsuir-3'),
-- Факультет компьютерных систем и сетей
('bsuir-s16', 'Информатика и технологии программирования', '1-40 04 01', 'bsuir-4'),
('bsuir-s17', 'Компьютерная инженерия', '1-40 04 02', 'bsuir-4'),
('bsuir-s18', 'Программная инженерия', '1-40 04 03', 'bsuir-4'),
-- Факультет информационной безопасности
('bsuir-s19', 'Информационная безопасность', '1-40 05 01', 'bsuir-5'),
('bsuir-s20', 'Системы и сети инфокоммуникаций', '1-40 05 02', 'bsuir-5'),
('bsuir-s21', 'Сверхвысокочастотные системы', '1-40 05 03', 'bsuir-5'),
-- Инженерно-экономический факультет
('bsuir-s22', 'Информационные системы и технологии', '1-40 06 01', 'bsuir-6'),
('bsuir-s23', 'Цифровой маркетинг', '1-40 06 02', 'bsuir-6'),
('bsuir-s24', 'Электронная экономика', '1-40 06 03', 'bsuir-6'),
-- Военный факультет
('bsuir-s25', 'Радиосистемы и радиотехнологии', '1-40 07 01', 'bsuir-7'),
('bsuir-s26', 'Компьютерная инженерия', '1-40 07 02', 'bsuir-7'),
('bsuir-s27', 'Системы и сети инфокоммуникаций', '1-40 07 03', 'bsuir-7'),
('bsuir-s28', 'Информационная безопасность', '1-40 07 04', 'bsuir-7')
ON CONFLICT (id) DO NOTHING;

-- Очищаем старые данные поступления БГУ и БГУИР
DELETE FROM public.admission_stats WHERE specialty_id LIKE 'bsu-s%' OR specialty_id LIKE 'bsuir-s%';

-- Добавляем данные поступления БГУ 2025
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, paid_min_score) VALUES
('bsu-s1', 2025, 50, 20, 371, 358),
('bsu-s2', 2025, 40, 25, 391, 359),
('bsu-s3', 2025, 35, 20, 387, 358),
('bsu-s4', 2025, 30, 15, 378, 341),
('bsu-s5', 2025, 40, 20, 346, 308),
('bsu-s6', 2025, 35, 15, 351, 313),
('bsu-s7', 2025, 30, 15, 360, 309);

-- Добавляем данные поступления БГУИР 2025
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, paid_min_score) VALUES
('bsuir-s1', 2025, 100, 50, 380, 326),
('bsuir-s2', 2025, 80, 40, 367, 308),
('bsuir-s3', 2025, 120, 60, 385, 345),
('bsuir-s4', 2025, 60, 30, 348, 296),
('bsuir-s5', 2025, 50, 25, 334, 295),
('bsuir-s6', 2025, 110, 55, 392, 332),
('bsuir-s7', 2025, 70, 35, 380, 347),
('bsuir-s8', 2025, 50, 25, 358, 318),
('bsuir-s9', 2025, 60, 30, 376, 323),
('bsuir-s10', 2025, 45, 20, 368, NULL),
('bsuir-s11', 2025, 40, 20, 330, 291),
('bsuir-s12', 2025, 30, 15, 260, NULL),
('bsuir-s13', 2025, 35, 15, 284, NULL),
('bsuir-s14', 2025, 30, 15, 313, NULL),
('bsuir-s15', 2025, 40, 20, 279, 280),
('bsuir-s16', 2025, 130, 65, 388, 339),
('bsuir-s17', 2025, 90, 45, 366, 301),
('bsuir-s18', 2025, 140, 70, 394, 362),
('bsuir-s19', 2025, 100, 50, 366, 314),
('bsuir-s20', 2025, 70, 35, 340, 297),
('bsuir-s21', 2025, 50, 25, 325, 294),
('bsuir-s22', 2025, 80, 40, 372, 316),
('bsuir-s23', 2025, 60, 30, 390, 315),
('bsuir-s24', 2025, 70, 35, 394, 328),
('bsuir-s25', 2025, 50, 0, 267, NULL),
('bsuir-s26', 2025, 60, 0, 342, NULL),
('bsuir-s27', 2025, 55, 0, 302, NULL),
('bsuir-s28', 2025, 65, 0, 333, NULL);

-- Добавляем данные поступления БГУИР 2024
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, paid_min_score) VALUES
('bsuir-s1', 2024, 151, 50, 378, 327),
('bsuir-s2', 2024, 112, 40, 364, 291),
('bsuir-s3', 2024, 130, 60, 393, 313),
('bsuir-s4', 2024, 139, 30, 336, 255),
('bsuir-s5', 2024, 164, 25, 387, 302),
('bsuir-s6', 2024, 120, 55, 366, 298),
('bsuir-s9', 2024, 179, 40, 382, 340),
('bsuir-s10', 2024, 80, 20, 358, 300),
('bsuir-s11', 2024, 182, 40, 382, 344),
('bsuir-s12', 2024, 177, 35, 376, 312),
('bsuir-s16', 2024, 182, 65, 382, 344),
('bsuir-s17', 2024, 182, 45, 382, 344),
('bsuir-s18', 2024, 182, 70, 382, 344),
('bsuir-s19', 2024, 110, 50, 238, 179),
('bsuir-s20', 2024, 90, 35, 329, 258),
('bsuir-s22', 2024, 162, 40, 366, 289),
('bsuir-s24', 2024, 162, 35, 395, 359);

-- Проверяем данные
SELECT '=== Проверка данных ===' as info;
SELECT 'Universities:' as type, COUNT(*) as count FROM public.universities WHERE id IN ('bsu', 'bsuir')
UNION ALL
SELECT 'Faculties:', COUNT(*) FROM public.faculties WHERE university_id IN ('bsu', 'bsuir')
UNION ALL
SELECT 'Specialties:', COUNT(*) FROM public.specialties WHERE id LIKE 'bsu-%' OR id LIKE 'bsuir-%'
UNION ALL
SELECT 'Admission Stats 2025:', COUNT(*) FROM public.admission_stats WHERE year = 2025
UNION ALL
SELECT 'Admission Stats 2024:', COUNT(*) FROM public.admission_stats WHERE year = 2024;

-- Показываем данные
SELECT * FROM public.admission_stats WHERE year = 2025 ORDER BY specialty_id;
