-- Полные данные БГУ 2023 - ВСЕ специальности из PDF
-- min_score = бюджет (выше), paid_min_score = платное (ниже)

DELETE FROM public.admission_stats WHERE specialty_id LIKE 'bsu-s%' AND year = 2023;

INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES

-- Биологический факультет (bsu-9)
('bsu-s39', 2023, NULL, NULL, 299, NULL, 197),
('bsu-s41', 2023, NULL, NULL, 337, NULL, 264),
('bsu-s40', 2023, NULL, NULL, 360, NULL, 289),
('bsu-s42', 2023, NULL, NULL, 363, NULL, 294),
('bsu-s45', 2023, NULL, NULL, 316, NULL, 275),
('bsu-s44', 2023, NULL, NULL, 316, NULL, 275),
('bsu-s43', 2023, NULL, NULL, 299, NULL, 229),

-- Факультет географии и геоинформатики (bsu-13)
('bsu-s62', 2023, NULL, NULL, 284, NULL, 267),
('bsu-s64', 2023, NULL, NULL, NULL, NULL, 293),
('bsu-s65', 2023, NULL, NULL, 331, NULL, 278),
('bsu-s66', 2023, NULL, NULL, 299, NULL, 274),
('bsu-s68', 2023, NULL, NULL, 361, NULL, 273),
('bsu-s63', 2023, NULL, NULL, 299, NULL, 270),
('bsu-s69', 2023, NULL, NULL, 305, NULL, 279),

-- Факультет социокультурных коммуникаций (bsu-11)
('bsu-s53', 2023, NULL, NULL, 262, NULL, 212),
('bsu-s55', 2023, NULL, NULL, 241, NULL, 217),
('bsu-s56', 2023, NULL, NULL, 254, NULL, 215),
('bsu-s57', 2023, NULL, NULL, NULL, NULL, 227),
('bsu-s52', 2023, NULL, NULL, 353, NULL, 298),
('bsu-s54', 2023, NULL, NULL, 346, NULL, 277),
('bsu-s50', 2023, NULL, NULL, 348, NULL, 210),
('bsu-s51', 2023, NULL, NULL, 361, NULL, 225),

-- Институт теологии БГУ (bsu-i2)
('bsu-s87', 2023, NULL, NULL, NULL, NULL, 264),

-- Исторический факультет (bsu-6)
('bsu-s28', 2023, NULL, NULL, 312, NULL, 275),
('bsu-s27', 2023, NULL, NULL, NULL, NULL, 320),
('bsu-s24', 2023, NULL, NULL, 338, NULL, 290),
('bsu-s26', 2023, NULL, NULL, 377, NULL, 279),
('bsu-s25', 2023, NULL, NULL, NULL, NULL, 323),

-- Факультет журналистики (bsu-12)
('bsu-s58', 2023, NULL, NULL, NULL, NULL, 340),
('bsu-s59', 2023, NULL, NULL, NULL, NULL, 369),

-- Факультет международных отношений (bsu-10)
('bsu-s47', 2023, NULL, NULL, 398, NULL, 346),
('bsu-s46', 2023, NULL, NULL, 394, NULL, 357),
('bsu-s48', 2023, NULL, NULL, 373, NULL, 272),

-- Механико-математический факультет (bsu-16)
('bsu-s81', 2023, NULL, NULL, 354, NULL, 296),
('bsu-s79', 2023, NULL, NULL, NULL, NULL, 318),
('bsu-s82', 2023, NULL, NULL, 355, NULL, 306),
('bsu-s80', 2023, NULL, NULL, NULL, NULL, 333),

-- Факультет прикладной математики и информатики (bsu-1)
('bsu-s3', 2023, NULL, NULL, 379, NULL, 318),
('bsu-s4', 2023, NULL, NULL, 370, NULL, 312),
('bsu-s1', 2023, NULL, NULL, 362, NULL, 327),
('bsu-s2', 2023, NULL, NULL, 386, NULL, 326),

-- Совместный институт БГУ и ДПУ (bsu-i4)
('bsu-s97', 2023, NULL, NULL, 347, NULL, 285),
('bsu-s95', 2023, NULL, NULL, 325, NULL, 254),

-- Факультет радиофизики (bsu-2)
('bsu-s6', 2023, NULL, NULL, 343, NULL, 297),
('bsu-s7', 2023, NULL, NULL, 347, NULL, 301),
('bsu-s5', 2023, NULL, NULL, 331, NULL, 256),

-- Физический факультет (bsu-8)
('bsu-s35', 2023, NULL, NULL, NULL, NULL, 315),
('bsu-s34', 2023, NULL, NULL, 345, NULL, 300),
('bsu-s36', 2023, NULL, NULL, NULL, NULL, 327),
('bsu-s38', 2023, NULL, NULL, NULL, NULL, 329),
('bsu-s37', 2023, NULL, NULL, NULL, NULL, 329),

-- МГЭИ (bsu-i3)
('bsu-s90', 2023, NULL, NULL, NULL, NULL, 304),
('bsu-s93', 2023, NULL, NULL, NULL, NULL, 302),
('bsu-s94', 2023, NULL, NULL, 281, NULL, 233),
('bsu-s92', 2023, NULL, NULL, NULL, NULL, 248),
('bsu-s89', 2023, NULL, NULL, NULL, NULL, 263),
('bsu-s88', 2023, NULL, NULL, 280, NULL, 175),
('bsu-s91', 2023, NULL, NULL, 318, NULL, 245),

-- Факультет философии и социальных наук (bsu-14)
('bsu-s72', 2023, NULL, NULL, 374, NULL, 310),
('bsu-s73', 2023, NULL, NULL, 380, NULL, 314),
('bsu-s71', 2023, NULL, NULL, 366, NULL, 294),
('bsu-s70', 2023, NULL, NULL, 363, NULL, 320),

-- Филологический факультет (bsu-5)
('bsu-s22', 2023, NULL, NULL, NULL, NULL, 261),
('bsu-s21', 2023, NULL, NULL, NULL, NULL, 305),
('bsu-s18', 2023, NULL, NULL, 361, NULL, 317),
('bsu-s19', 2023, NULL, NULL, 366, NULL, 188),
('bsu-s20', 2023, NULL, NULL, NULL, NULL, 295),
('bsu-s23', 2023, NULL, NULL, NULL, NULL, 318),

-- Химический факультет (bsu-7)
('bsu-s33', 2023, NULL, NULL, NULL, NULL, 318),
('bsu-s29', 2023, NULL, NULL, 332, NULL, 241),
('bsu-s31', 2023, NULL, NULL, NULL, NULL, 327),
('bsu-s32', 2023, NULL, NULL, 334, NULL, 261),
('bsu-s30', 2023, NULL, NULL, 349, NULL, 311),

-- Экономический факультет (bsu-3)
('bsu-s10', 2023, NULL, NULL, 388, NULL, 283),
('bsu-s11', 2023, NULL, NULL, 368, NULL, 261),
('bsu-s12', 2023, NULL, NULL, 379, NULL, 256),
('bsu-s14', 2023, NULL, NULL, 391, NULL, 330),
('bsu-s13', 2023, NULL, NULL, 378, NULL, 324),
('bsu-s9', 2023, NULL, NULL, NULL, NULL, 368),
('bsu-s8', 2023, NULL, NULL, 376, NULL, 256),

-- Юридический факультет (bsu-4)
('bsu-s17', 2023, NULL, NULL, 373, NULL, 315),
('bsu-s16', 2023, NULL, NULL, 375, NULL, 325),
('bsu-s15', 2023, NULL, NULL, 373, NULL, 314),
('bsu-s110', 2023, NULL, NULL, 205, NULL, 162),

-- Военный факультет (bsu-15)
('bsu-s75', 2023, NULL, NULL, NULL, NULL, 343),
('bsu-s77', 2023, NULL, NULL, NULL, NULL, 346),
('bsu-s78', 2023, NULL, NULL, NULL, NULL, 395),
('bsu-s76', 2023, NULL, NULL, NULL, NULL, 230),
('bsu-s74', 2023, NULL, NULL, NULL, NULL, 312),

-- Институт бизнеса БГУ (bsu-i1) - только платное
('bsu-s86', 2023, NULL, NULL, NULL, NULL, 295),
('bsu-s85', 2023, NULL, NULL, NULL, NULL, 307),
('bsu-s83', 2023, NULL, NULL, NULL, NULL, 318),
('bsu-s84', 2023, NULL, NULL, NULL, NULL, 284);
