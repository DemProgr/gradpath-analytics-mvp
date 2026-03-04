-- Данные БГУИР 2025
-- min_score = бюджет, paid_min_score = платное

DELETE FROM public.admission_stats WHERE specialty_id LIKE 'bsuir-s%' AND year = 2025;

INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES

-- Факультет компьютерного проектирования (bsuir-1)
('bsuir-s1', 2025, NULL, NULL, 380, NULL, 326),
('bsuir-s2', 2025, NULL, NULL, 367, NULL, 308),
('bsuir-s3', 2025, NULL, NULL, 385, NULL, 345),
('bsuir-s4', 2025, NULL, NULL, 348, NULL, 296),
('bsuir-s5', 2025, NULL, NULL, 334, NULL, 295),

-- ФИТУ (bsuir-2)
('bsuir-s6', 2025, NULL, NULL, 392, NULL, 332),
('bsuir-s7', 2025, NULL, NULL, 380, NULL, 347),
('bsuir-s8', 2025, NULL, NULL, 358, NULL, 318),
('bsuir-s9', 2025, NULL, NULL, 376, NULL, 323),
('bsuir-s10', 2025, NULL, NULL, 368, NULL, NULL),

-- ФРЭ (bsuir-3)
('bsuir-s11', 2025, NULL, NULL, 330, NULL, 291),
('bsuir-s12', 2025, NULL, NULL, 260, NULL, NULL),
('bsuir-s13', 2025, NULL, NULL, 284, NULL, NULL),
('bsuir-s14', 2025, NULL, NULL, 313, NULL, NULL),
('bsuir-s15', 2025, NULL, NULL, 279, NULL, 280),

-- ФИБ (bsuir-5)
('bsuir-s19', 2025, NULL, NULL, 366, NULL, 314),
('bsuir-s20', 2025, NULL, NULL, 340, NULL, 297),
('bsuir-s21', 2025, NULL, NULL, 325, NULL, 294),

-- ИЭФ (bsuir-6)
('bsuir-s22', 2025, NULL, NULL, 372, NULL, 316),
('bsuir-s24', 2025, NULL, NULL, 394, NULL, 328),
('bsuir-s23', 2025, NULL, NULL, 390, NULL, 315),

-- ВФ (bsuir-7) - 4 специальности
('bsuir-s25', 2025, NULL, NULL, 267, NULL, NULL),
('bsuir-s26', 2025, NULL, NULL, 342, NULL, NULL),
('bsuir-s27', 2025, NULL, NULL, 302, NULL, NULL),
('bsuir-s28', 2025, NULL, NULL, 333, NULL, NULL);
