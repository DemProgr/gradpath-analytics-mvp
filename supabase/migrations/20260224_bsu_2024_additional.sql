-- Данные БГУ 2024 - добавляем недостающие специальности
-- Выполнить в Supabase SQL Editor

-- Добавляем недостающие специальности за 2024 год

-- Биологический факультет (bsu-9) - добавляем bsu-s45
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s45', 2024, NULL, NULL, 328, NULL, 349)
ON CONFLICT DO NOTHING;

-- Исторический факультет (bsu-6) - добавляем bsu-s24
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s24', 2024, NULL, NULL, 249, NULL, 341)
ON CONFLICT DO NOTHING;

-- Совместный институт БГУ и ДПУ (bsu-i4) - добавляем bsu-s96
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s96', 2024, NULL, NULL, NULL, NULL, 306)
ON CONFLICT DO NOTHING;

-- Новые специальности ФМО (bsu-10) за 2024 год
-- Данные приблизительные - нужно проверить по PDF
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s100', 2024, NULL, NULL, NULL, NULL, NULL),
('bsu-s101', 2024, NULL, NULL, NULL, NULL, NULL),
('bsu-s102', 2024, NULL, NULL, NULL, NULL, NULL),
('bsu-s103', 2024, NULL, NULL, NULL, NULL, NULL),
('bsu-s104', 2024, NULL, NULL, NULL, NULL, NULL),
('bsu-s105', 2024, NULL, NULL, NULL, NULL, NULL)
ON CONFLICT DO NOTHING;

-- Новые специальности Филологического факультета (bsu-5) за 2024
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s106', 2024, NULL, NULL, NULL, NULL, NULL),
('bsu-s107', 2024, NULL, NULL, NULL, NULL, NULL),
('bsu-s108', 2024, NULL, NULL, NULL, NULL, NULL),
('bsu-s109', 2024, NULL, NULL, NULL, NULL, NULL)
ON CONFLICT DO NOTHING;

-- Юридический факультет - добавляем bsu-s110 (правоведение сокращенный срок)
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s110', 2024, NULL, NULL, NULL, NULL, NULL)
ON CONFLICT DO NOTHING;

-- Факультет радиофизики - добавляем bsu-s111
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s111', 2024, NULL, NULL, NULL, NULL, NULL)
ON CONFLICT DO NOTHING;

-- Также нужно исправить дубликаты - bsu-s10 и bsu-s18 это разные специальности на разных факультетах
-- Удаляем старые дубликаты и добавляем правильные
DELETE FROM public.admission_stats WHERE specialty_id = 'bsu-s10' AND year = 2024;
DELETE FROM public.admission_stats WHERE specialty_id = 'bsu-s18' AND year = 2024;

-- Экономический факультет (bsu-3)
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s10', 2024, NULL, NULL, 296, NULL, 389)
ON CONFLICT DO NOTHING;

-- Филологический факультет (bsu-5) - Востоковедение
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s18', 2024, NULL, NULL, 330, NULL, 361)
ON CONFLICT DO NOTHING;
