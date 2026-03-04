-- Данные БГУ 2022 - из сайтов kudapostupat.by
-- min_score = бюджет (выше), paid_min_score = платное

DELETE FROM public.admission_stats WHERE specialty_id LIKE 'bsu-s%' AND year = 2022;

INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES

-- Биологический факультет (bsu-9)
('bsu-s42', 2022, NULL, NULL, 358, NULL, NULL),
('bsu-s40', 2022, NULL, NULL, 347, NULL, NULL),
('bsu-s41', 2022, NULL, NULL, 325, NULL, NULL),
('bsu-s39', 2022, NULL, NULL, 337, NULL, NULL),
('bsu-s45', 2022, NULL, NULL, 324, NULL, NULL),
('bsu-s43', 2022, NULL, NULL, 321, NULL, NULL),

-- Химический факультет (bsu-7)
('bsu-s30', 2022, NULL, NULL, 336, NULL, NULL),
('bsu-s33', 2022, NULL, NULL, 344, NULL, NULL),
('bsu-s32', 2022, NULL, NULL, 331, NULL, NULL),
('bsu-s31', 2022, NULL, NULL, 314, NULL, NULL),
('bsu-s29', 2022, NULL, NULL, 318, NULL, NULL),

-- География и геоинформатика (bsu-13)
('bsu-s68', 2022, NULL, NULL, 326, NULL, NULL),
('bsu-s65', 2022, NULL, NULL, 294, NULL, NULL),
('bsu-s62', 2022, NULL, NULL, 239, NULL, NULL),
('bsu-s66', 2022, NULL, NULL, 266, NULL, NULL),
('bsu-s63', 2022, NULL, NULL, 263, NULL, NULL),
('bsu-s67', 2022, NULL, NULL, 247, NULL, NULL),
('bsu-s64', 2022, NULL, NULL, 246, NULL, NULL),

-- Факультет социокультурных коммуникаций (bsu-11)
('bsu-s53', 2022, NULL, NULL, 231, NULL, NULL),
('bsu-s55', 2022, NULL, NULL, 238, NULL, NULL),
('bsu-s56', 2022, NULL, NULL, 249, NULL, NULL),
('bsu-s57', 2022, NULL, NULL, 243, NULL, NULL),
('bsu-s50', 2022, NULL, NULL, 344, NULL, NULL),

-- Институт теологии (bsu-i2)
('bsu-s87', 2022, NULL, NULL, NULL, NULL, NULL),

-- Исторический факультет (bsu-6)
('bsu-s24', 2022, NULL, NULL, 328, NULL, NULL),
('bsu-s25', 2022, NULL, NULL, 301, NULL, NULL),
('bsu-s27', 2022, NULL, NULL, 280, NULL, NULL),
('bsu-s28', 2022, NULL, NULL, 253, NULL, NULL),
('bsu-s26', 2022, NULL, NULL, 368, NULL, NULL),

-- Журналистика (bsu-12)
('bsu-s58', 2022, NULL, NULL, 296, NULL, NULL),
('bsu-s59', 2022, NULL, NULL, 296, NULL, NULL),

-- Факультет международных отношений (bsu-10)
('bsu-s47', 2022, NULL, NULL, 374, NULL, NULL),
('bsu-s46', 2022, NULL, NULL, 377, NULL, NULL),
('bsu-s48', 2022, NULL, NULL, 342, NULL, NULL),
('bsu-s103', 2022, NULL, NULL, 364, NULL, NULL),
('bsu-s102', 2022, NULL, NULL, 359, NULL, NULL),

-- Мехмат (bsu-16)
('bsu-s81', 2022, NULL, NULL, 345, NULL, NULL),
('bsu-s82', 2022, NULL, NULL, 336, NULL, NULL),
('bsu-s79', 2022, NULL, NULL, 325, NULL, NULL),
('bsu-s80', 2022, NULL, NULL, 320, NULL, NULL),

-- ФПМИ (bsu-1)
('bsu-s2', 2022, NULL, NULL, 372, NULL, NULL),
('bsu-s3', 2022, NULL, NULL, 355, NULL, NULL),
('bsu-s4', 2022, NULL, NULL, 345, NULL, NULL),
('bsu-s1', 2022, NULL, NULL, 334, NULL, NULL),

-- Радиофизики (bsu-2)
('bsu-s6', 2022, NULL, NULL, 318, NULL, NULL),
('bsu-s7', 2022, NULL, NULL, 314, NULL, NULL),
('bsu-s5', 2022, NULL, NULL, 294, NULL, NULL),

-- Физический факультет (bsu-8)
('bsu-s34', 2022, NULL, NULL, 308, NULL, NULL),
('bsu-s37', 2022, NULL, NULL, 304, NULL, NULL),
('bsu-s38', 2022, NULL, NULL, 293, NULL, NULL),
('bsu-s36', 2022, NULL, NULL, 292, NULL, NULL),

-- МГЭИ (bsu-i3)
('bsu-s90', 2022, NULL, NULL, 283, NULL, NULL),
('bsu-s93', 2022, NULL, NULL, 280, NULL, NULL),
('bsu-s91', 2022, NULL, NULL, 296, NULL, NULL),

-- ФФСиН (bsu-14)
('bsu-s72', 2022, NULL, NULL, 346, NULL, NULL),
('bsu-s73', 2022, NULL, NULL, 344, NULL, NULL),
('bsu-s71', 2022, NULL, NULL, 323, NULL, NULL),
('bsu-s70', 2022, NULL, NULL, 323, NULL, NULL),

-- Филологический факультет (bsu-5)
('bsu-s20', 2022, NULL, NULL, 213, NULL, NULL),
('bsu-s22', 2022, NULL, NULL, 188, NULL, NULL),
('bsu-s21', 2022, NULL, NULL, 339, NULL, NULL),

-- Экономический факультет (bsu-3)
('bsu-s10', 2022, NULL, NULL, 360, NULL, NULL),
('bsu-s14', 2022, NULL, NULL, 367, NULL, NULL),
('bsu-s11', 2022, NULL, NULL, 353, NULL, NULL),
('bsu-s12', 2022, NULL, NULL, 353, NULL, NULL),
('bsu-s13', 2022, NULL, NULL, 356, NULL, NULL),

-- Юридический факультет (bsu-4)
('bsu-s15', 2022, NULL, NULL, 358, NULL, NULL),
('bsu-s16', 2022, NULL, NULL, 350, NULL, NULL),
('bsu-s17', 2022, NULL, NULL, NULL, NULL, NULL),
('bsu-s110', 2022, NULL, NULL, 227, NULL, NULL);
