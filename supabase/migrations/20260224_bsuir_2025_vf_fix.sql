-- Удаляем старые дубликаты ВФ и добавляем 10 правильных записей

-- Удаляем все старые записи ВФ за 2025
DELETE FROM public.admission_stats WHERE specialty_id LIKE 'bsuir-s2%' AND year = 2025;

-- Вставляем 10 правильных записей ВФ
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
-- Радиосистемы и радиотехнологии (ВС)
('bsuir-s25', 2025, NULL, NULL, 267, NULL, NULL),
-- Компьютерная инженерия (ВС)
('bsuir-s26', 2025, NULL, NULL, 342, NULL, NULL),
-- Компьютерная инженерия (ГПК)
('bsuir-s26-gpk', 2025, NULL, NULL, 315, NULL, NULL),
-- Системы и сети инфокоммуникаций (СТСН) (ВС)
('bsuir-s27', 2025, NULL, NULL, 302, NULL, NULL),
-- Системы и сети инфокоммуникаций (СТСН) (ВС) жен.
('bsuir-s27-zh', 2025, NULL, NULL, 345, NULL, NULL),
-- Системы и сети инфокоммуникаций (СТСН) (ГПК)
('bsuir-s27-gpk', 2025, NULL, NULL, 310, NULL, NULL),
-- Системы и сети инфокоммуникаций (ССКП) (ВС)
('bsuir-s27-sskp', 2025, NULL, NULL, 292, NULL, NULL),
-- Информационная безопасность (ГПК)
('bsuir-s28-gpk', 2025, NULL, NULL, 330, NULL, NULL),
-- Информационная безопасность (МВД)
('bsuir-s28-mvd', 2025, NULL, NULL, 294, NULL, NULL),
-- Информационная безопасность (ВС)
('bsuir-s28-vs', 2025, NULL, NULL, 333, NULL, NULL);
