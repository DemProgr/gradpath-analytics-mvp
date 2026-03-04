-- Факультет международных отношений (bsu-10) - только 8 специальностей за 2024
-- Удаляем лишние и оставляем только 8

-- Удаляем старые данные за 2024 для ФМО
DELETE FROM public.admission_stats WHERE specialty_id IN ('bsu-s100', 'bsu-s101', 'bsu-s102', 'bsu-s103', 'bsu-s104', 'bsu-s105', 'bsu-s49') AND year = 2024;

-- Вставляем только 8 правильных специальностей
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s18', 2024, NULL, NULL, 335, NULL, 381),
('bsu-s47', 2024, NULL, NULL, 343, NULL, 390),
('bsu-s46', 2024, NULL, NULL, 323, NULL, 390),
('bsu-s102', 2024, NULL, NULL, 270, NULL, 382),
('bsu-s103', 2024, NULL, NULL, 310, NULL, 395),
('bsu-s101', 2024, NULL, NULL, 333, NULL, 386),
('bsu-s104', 2024, NULL, NULL, 313, NULL, 369),
('bsu-s48', 2024, NULL, NULL, 284, NULL, 350)
ON CONFLICT DO NOTHING;
