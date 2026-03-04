-- Исправление данных БГУ 2025 - добавляем недостающие специальности и баллы
-- Выполнить в Supabase SQL Editor

-- 1. Добавляем специальность bsu-s96 (Мировая экономика в Совместном институте БГУ и ДПУ)
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s96', 2025, NULL, NULL, 353, NULL, NULL)
ON CONFLICT DO NOTHING;

-- 2. Добавляем недостающие специальности в таблицу specialties
-- Филологический факультет (bsu-5) - новые направления романо-германской филологии
INSERT INTO public.specialties (id, university_id, name, code, faculty_id, institute_id) VALUES
('bsu-s106', 'bsu', 'Славянская (славянская и русская) филология', '6-05-0212-02', 'bsu-5', NULL),
('bsu-s107', 'bsu', 'Романо-германская (итальянская) филология', '6-05-0213-05', 'bsu-5', NULL),
('bsu-s108', 'bsu', 'Романо-германская (немецкая) филология', '6-05-0213-03', 'bsu-5', NULL),
('bsu-s109', 'bsu', 'Романо-германская (французская) филология', '6-05-0213-04', 'bsu-5', NULL),
-- Юридический факультет (bsu-4) - правоведение сокращенный срок
('bsu-s110', 'bsu', 'Правоведение (сокращенный срок)', '6-05-0421-02', 'bsu-4', NULL),
-- Факультет радиофизики (bsu-2) - прикладная информатика (отдельная от bsu-s7)
('bsu-s111', 'bsu', 'Прикладная информатика (радиофизика)', '6-05-0313-03', 'bsu-2', NULL)
ON CONFLICT (id) DO NOTHING;

-- 3. Добавляем баллы для новых специальностей
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
-- Филологический факультет
('bsu-s106', 2025, NULL, NULL, 328, NULL, NULL),
('bsu-s107', 2025, NULL, NULL, 348, NULL, 304),
('bsu-s108', 2025, NULL, NULL, 351, NULL, 294),
('bsu-s109', 2025, NULL, NULL, 344, NULL, 294),
-- Юридический факультет
('bsu-s110', 2025, NULL, NULL, 229, NULL, 162),
-- Факультет радиофизики - прикладная информатика 353/322 (отличается от bsu-s7)
('bsu-s111', 2025, NULL, NULL, 353, NULL, 322);
