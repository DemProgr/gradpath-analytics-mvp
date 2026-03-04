-- Добавляем недостающие специальности БГУ в таблицу specialties
-- Факультет международных отношений (bsu-10)
INSERT INTO public.specialties (id, university_id, name, code, faculty_id, institute_id) VALUES
('bsu-s100', 'bsu', 'Востоковедение', '6-05-0312-03', 'bsu-10', NULL),
('bsu-s101', 'bsu', 'Международная конфликтология', '6-05-0312-04', 'bsu-10', NULL),
('bsu-s102', 'bsu', 'Менеджмент (международный)', '6-05-0412-01', 'bsu-10', NULL),
('bsu-s103', 'bsu', 'Мировая экономика', '6-05-0311-03', 'bsu-10', NULL),
('bsu-s104', 'bsu', 'Международная логистика', '6-05-1036-04', 'bsu-10', NULL),
('bsu-s105', 'bsu', 'Африканистика', '6-05-0312-05', 'bsu-10', NULL)
ON CONFLICT (id) DO NOTHING;
