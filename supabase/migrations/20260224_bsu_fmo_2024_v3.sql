-- Факультет международных отношений (bsu-10) - 8 специальностей за 2024
-- Исправлено: бюджет и платное поменяны местами, добавлено востоковедение

-- Удаляем старые данные за 2024 для ФМО
DELETE FROM public.admission_stats WHERE specialty_id IN (
    'bsu-s18', 'bsu-s46', 'bsu-s47', 'bsu-s48', 'bsu-s49',
    'bsu-s100', 'bsu-s101', 'bsu-s102', 'bsu-s103', 'bsu-s104', 'bsu-s105'
) AND year = 2024;

-- Вставляем 8 правильных специальностей с исправленными баллами
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
-- Востоковедение - bsu-s100 (ФМО)
('bsu-s100', 2024, NULL, NULL, 381, NULL, 335),
-- Международное право - bsu-s47
('bsu-s47', 2024, NULL, NULL, 390, NULL, 343),
-- Международные отношения - bsu-s46
('bsu-s46', 2024, NULL, NULL, 390, NULL, 323),
-- Менеджмент - bsu-s102
('bsu-s102', 2024, NULL, NULL, 382, NULL, 270),
-- Мировая экономика - bsu-s103
('bsu-s103', 2024, NULL, NULL, 395, NULL, 310),
-- Международная конфликтология - bsu-s101
('bsu-s101', 2024, NULL, NULL, 386, NULL, 333),
-- Международная логистика - bsu-s104
('bsu-s104', 2024, NULL, NULL, 369, NULL, 313),
-- Таможенное дело - bsu-s48
('bsu-s48', 2024, NULL, NULL, 350, NULL, 284);
