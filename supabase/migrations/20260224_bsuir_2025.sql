-- Данные БГУИР 2025 - из сайтов kudapostupat.by и abitur.bsuir.by
-- min_score = бюджет (выше), paid_min_score = платное

DELETE FROM public.admission_stats WHERE specialty_id LIKE 'bsuir-s%' AND year = 2025;

INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES

-- Факультет компьютерного проектирования (bsuir-1)
-- Информационные системы и технологии
('bsuir-s1', 2025, NULL, NULL, 380, NULL, 326),
-- Компьютерная инженерия
('bsuir-s2', 2025, NULL, NULL, 367, NULL, 308),
-- Программная инженерия
('bsuir-s3', 2025, NULL, NULL, 385, NULL, 345),
-- Электронные системы и технологии
('bsuir-s4', 2025, NULL, NULL, 348, NULL, 296),
-- Электронное машиностроение
('bsuir-s5', 2025, NULL, NULL, 334, NULL, 295),

-- Факультет информационных технологий и управления (bsuir-2)
-- Информационные системы и технологии
('bsuir-s6', 2025, NULL, NULL, 392, NULL, 332),
-- Искусственный интеллект
('bsuir-s7', 2025, NULL, NULL, 380, NULL, 347),
-- Киберфизические системы
('bsuir-s8', 2025, NULL, NULL, 358, NULL, 318),
-- Системы управления информацией
('bsuir-s9', 2025, NULL, NULL, 376, NULL, 323),
-- Электронные системы и технологии
('bsuir-s10', 2025, NULL, NULL, 368, NULL, NULL),

-- Факультет радиотехники и электроники (bsuir-3)
-- Информационные и управляющие системы физических установок
('bsuir-s11', 2025, NULL, NULL, 330, NULL, 291),
-- Инженерно-педагогическая деятельность
('bsuir-s12', 2025, NULL, NULL, 260, NULL, NULL),
-- Микро- и наноэлектроника
('bsuir-s13', 2025, NULL, NULL, 284, NULL, NULL),
-- Нанотехнологии и наноматериалы
('bsuir-s14', 2025, NULL, NULL, 313, NULL, NULL),
-- Радиосистемы и радиотехнологии
('bsuir-s15', 2025, NULL, NULL, 279, NULL, 280),

-- Факультет компьютерных систем и сетей (bsuir-4)
-- Информатика и технологии программирования
('bsuir-s16', 2025, NULL, NULL, 388, NULL, 339),
-- Компьютерная инженерия
('bsuir-s17', 2025, NULL, NULL, 366, NULL, 301),
-- Программная инженерия
('bsuir-s18', 2025, NULL, NULL, 394, NULL, 362),

-- Факультет информационной безопасности (bsuir-5)
-- Информационная безопасность
('bsuir-s19', 2025, NULL, NULL, 366, NULL, 314),
-- Системы и сети инфокоммуникаций
('bsuir-s20', 2025, NULL, NULL, 340, NULL, 297),
-- Сверхвысокочастотные системы
('bsuir-s21', 2025, NULL, NULL, 325, NULL, 294),

-- Инженерно-экономический факультет (bsuir-6)
-- Информационные системы и технологии
('bsuir-s22', 2025, NULL, NULL, 372, NULL, 316),
-- Электронная экономика
('bsuir-s24', 2025, NULL, NULL, 394, NULL, 328),
-- Цифровой маркетинг
('bsuir-s23', 2025, NULL, NULL, 390, NULL, 315),

-- Военный факультет (bsuir-7)
-- Радиосистемы и радиотехнологии
('bsuir-s25', 2025, NULL, NULL, 267, NULL, NULL),
-- Компьютерная инженерия
('bsuir-s26', 2025, NULL, NULL, 342, NULL, NULL),
-- Системы и сети инфокоммуникаций
('bsuir-s27', 2025, NULL, NULL, 302, NULL, NULL),
-- Информационная безопасность
('bsuir-s28', 2025, NULL, NULL, 333, NULL, NULL);
