-- Добавляем 10 специальностей ВФ БГУИР в таблицу specialties

INSERT INTO public.specialties (id, university_id, name, code, faculty_id, institute_id) VALUES
-- Информационная безопасность (ГПК)
('bsuir-s28-gpk', 'bsuir', 'Информационная безопасность (ГПК)', '1-40 07 04', 'bsuir-7', NULL),
-- Информационная безопасность (МВД)
('bsuir-s28-mvd', 'bsuir', 'Информационная безопасность (МВД)', '1-40 07 04', 'bsuir-7', NULL),
-- Информационная безопасность (ВС)
('bsuir-s28-vs', 'bsuir', 'Информационная безопасность (ВС)', '1-40 07 04', 'bsuir-7', NULL),
-- Компьютерная инженерия (ВС)
('bsuir-s26-vs', 'bsuir', 'Компьютерная инженерия (ВС)', '1-40 07 02', 'bsuir-7', NULL),
-- Компьютерная инженерия (ГПК)
('bsuir-s26-gpk', 'bsuir', 'Компьютерная инженерия (ГПК)', '1-40 07 02', 'bsuir-7', NULL),
-- Системы и сети инфокоммуникаций (СТСН) (ВС)
('bsuir-s27-stsn-vs', 'bsuir', 'Системы и сети инфокоммуникаций (СТСН) (ВС)', '1-40 07 03', 'bsuir-7', NULL),
-- Системы и сети инфокоммуникаций (СТСН) (ВС) жен.
('bsuir-s27-stsn-vs-zh', 'bsuir', 'Системы и сети инфокоммуникаций (СТСН) (ВС) жен.', '1-40 07 03', 'bsuir-7', NULL),
-- Системы и сети инфокоммуникаций (СТСН) (ГПК)
('bsuir-s27-stsn-gpk', 'bsuir', 'Системы и сети инфокоммуникаций (СТСН) (ГПК)', '1-40 07 03', 'bsuir-7', NULL),
-- Системы и сети инфокоммуникаций (ССКП) (ВС)
('bsuir-s27-sskp', 'bsuir', 'Системы и сети инфокоммуникаций (ССКП) (ВС)', '1-40 07 03', 'bsuir-7', NULL)
ON CONFLICT (id) DO NOTHING;

-- Данные баллов 2025 для ВФ
DELETE FROM public.admission_stats WHERE specialty_id LIKE 'bsuir-s2%' AND year = 2025 AND specialty_id IN ('bsuir-s25', 'bsuir-s26', 'bsuir-s27', 'bsuir-s28');

INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
-- Радиосистемы и радиотехнологии (ВС)
('bsuir-s25', 2025, NULL, NULL, 267, NULL, NULL),
-- Компьютерная инженерия (ВС)
('bsuir-s26-vs', 2025, NULL, NULL, 342, NULL, NULL),
-- Компьютерная инженерия (ГПК)
('bsuir-s26-gpk', 2025, NULL, NULL, 315, NULL, NULL),
-- Системы и сети инфокоммуникаций (СТСН) (ВС)
('bsuir-s27-stsn-vs', 2025, NULL, NULL, 302, NULL, NULL),
-- Системы и сети инфокоммуникаций (СТСН) (ВС) жен.
('bsuir-s27-stsn-vs-zh', 2025, NULL, NULL, 345, NULL, NULL),
-- Системы и сети инфокоммуникаций (СТСН) (ГПК)
('bsuir-s27-stsn-gpk', 2025, NULL, NULL, 310, NULL, NULL),
-- Системы и сети инфокоммуникаций (ССКП) (ВС)
('bsuir-s27-sskp', 2025, NULL, NULL, 292, NULL, NULL),
-- Информационная безопасность (ГПК)
('bsuir-s28-gpk', 2025, NULL, NULL, 330, NULL, NULL),
-- Информационная безопасность (МВД)
('bsuir-s28-mvd', 2025, NULL, NULL, 294, NULL, NULL),
-- Информационная безопасность (ВС)
('bsuir-s28-vs', 2025, NULL, NULL, 333, NULL, NULL);
