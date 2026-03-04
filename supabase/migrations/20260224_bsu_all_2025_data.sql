-- Полные данные БГУ 2025 для ВСЕХ факультетов
-- Выполнить в Supabase SQL Editor

-- Механико-математический факультет (bsu-16)
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s81', 2025, NULL, NULL, 360, NULL, 319),
('bsu-s79', 2025, NULL, NULL, 262, NULL, NULL),
('bsu-s82', 2025, NULL, NULL, 364, NULL, 333),
('bsu-s80', 2025, NULL, NULL, 354, NULL, NULL)
ON CONFLICT DO NOTHING;

-- Факультет прикладной математики и информатики (bsu-1)
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s3', 2025, NULL, NULL, 387, NULL, 358),
('bsu-s4', 2025, NULL, NULL, 378, NULL, 341),
('bsu-s1', 2025, NULL, NULL, 371, NULL, 358),
('bsu-s2', 2025, NULL, NULL, 391, NULL, 359)
ON CONFLICT DO NOTHING;

-- Факультет радиофизики и компьютерных технологий (bsu-2)
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s6', 2025, NULL, NULL, 351, NULL, 313),
('bsu-s7', 2025, NULL, NULL, 360, NULL, 309),
('bsu-s5', 2025, NULL, NULL, 346, NULL, 308),
('bsu-s111', 2025, NULL, NULL, 353, NULL, 322)
ON CONFLICT DO NOTHING;

-- Физический факультет (bsu-8)
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s35', 2025, NULL, NULL, 341, NULL, NULL),
('bsu-s34', 2025, NULL, NULL, 351, NULL, 322),
('bsu-s36', 2025, NULL, NULL, 329, NULL, NULL),
('bsu-s38', 2025, NULL, NULL, 193, NULL, NULL),
('bsu-s37', 2025, NULL, NULL, 337, NULL, NULL)
ON CONFLICT DO NOTHING;

-- Химический факультет (bsu-7)
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s33', 2025, NULL, NULL, 329, NULL, NULL),
('bsu-s29', 2025, NULL, NULL, 355, NULL, 330),
('bsu-s31', 2025, NULL, NULL, 351, NULL, NULL),
('bsu-s32', 2025, NULL, NULL, 357, NULL, NULL),
('bsu-s30', 2025, NULL, NULL, 358, NULL, 324)
ON CONFLICT DO NOTHING;

-- Экономический факультет (bsu-3)
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s10', 2025, NULL, NULL, 391, NULL, 325),
('bsu-s11', 2025, NULL, NULL, 382, NULL, 314),
('bsu-s12', 2025, NULL, NULL, 387, NULL, 314),
('bsu-s14', 2025, NULL, NULL, 393, NULL, 354),
('bsu-s13', 2025, NULL, NULL, 388, NULL, 334),
('bsu-s9', 2025, NULL, NULL, 382, NULL, NULL),
('bsu-s8', 2025, NULL, NULL, 397, NULL, 371)
ON CONFLICT DO NOTHING;

-- Юридический факультет (bsu-4)
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s17', 2025, NULL, NULL, 366, NULL, 339),
('bsu-s16', 2025, NULL, NULL, 362, NULL, 334),
('bsu-s15', 2025, NULL, NULL, 362, NULL, 329),
('bsu-s110', 2025, NULL, NULL, 229, NULL, 162)
ON CONFLICT DO NOTHING;

-- Филологический факультет (bsu-5)
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s22', 2025, NULL, NULL, 322, NULL, NULL),
('bsu-s21', 2025, NULL, NULL, 338, NULL, NULL),
('bsu-s20', 2025, NULL, NULL, 337, NULL, NULL),
('bsu-s18', 2025, NULL, NULL, 366, NULL, 325),
('bsu-s19', 2025, NULL, NULL, 363, NULL, 320),
('bsu-s23', 2025, NULL, NULL, 344, NULL, 295),
('bsu-s106', 2025, NULL, NULL, 328, NULL, NULL),
('bsu-s107', 2025, NULL, NULL, 348, NULL, 304),
('bsu-s108', 2025, NULL, NULL, 351, NULL, 294),
('bsu-s109', 2025, NULL, NULL, 344, NULL, 294)
ON CONFLICT DO NOTHING;

-- Исторический факультет (bsu-6)
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s28', 2025, NULL, NULL, 315, NULL, NULL),
('bsu-s27', 2025, NULL, NULL, 322, NULL, NULL),
('bsu-s24', 2025, NULL, NULL, 347, NULL, 296),
('bsu-s26', 2025, NULL, NULL, 374, NULL, 301),
('bsu-s25', 2025, NULL, NULL, 324, NULL, NULL)
ON CONFLICT DO NOTHING;

-- Факультет журналистики (bsu-12)
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s58', 2025, NULL, NULL, 341, NULL, NULL),
('bsu-s59', 2025, NULL, NULL, 362, NULL, NULL)
ON CONFLICT DO NOTHING;

-- Факультет социокультурных коммуникаций (bsu-11)
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s53', 2025, NULL, NULL, 229, NULL, 209),
('bsu-s55', 2025, NULL, NULL, 234, NULL, 215),
('bsu-s56', 2025, NULL, NULL, 254, NULL, 220),
('bsu-s57', 2025, NULL, NULL, 251, NULL, NULL),
('bsu-s52', 2025, NULL, NULL, 342, NULL, 301),
('bsu-s54', 2025, NULL, NULL, 366, NULL, 342),
('bsu-s50', 2025, NULL, NULL, 350, NULL, 293),
('bsu-s51', 2025, NULL, NULL, 377, NULL, 297)
ON CONFLICT DO NOTHING;

-- Факультет международных отношений (bsu-10)
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s46', 2025, NULL, NULL, 395, NULL, 358),
('bsu-s100', 2025, NULL, NULL, 388, NULL, 340),
('bsu-s101', 2025, NULL, NULL, 394, NULL, 344),
('bsu-s47', 2025, NULL, NULL, 398, NULL, 353),
('bsu-s102', 2025, NULL, NULL, 396, NULL, 329),
('bsu-s103', 2025, NULL, NULL, 398, NULL, 348),
('bsu-s48', 2025, NULL, NULL, 377, NULL, NULL),
('bsu-s104', 2025, NULL, NULL, 393, NULL, 316),
('bsu-s105', 2025, NULL, NULL, 387, NULL, 342),
('bsu-s49', 2025, NULL, NULL, 377, NULL, NULL)
ON CONFLICT DO NOTHING;

-- Факультет географии и геоинформатики (bsu-13)
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s62', 2025, NULL, NULL, 302, NULL, 291),
('bsu-s64', 2025, NULL, NULL, 316, NULL, NULL),
('bsu-s65', 2025, NULL, NULL, 347, NULL, 295),
('bsu-s66', 2025, NULL, NULL, 327, NULL, 291),
('bsu-s68', 2025, NULL, NULL, 351, NULL, 293),
('bsu-s63', 2025, NULL, NULL, 309, NULL, 292),
('bsu-s69', 2025, NULL, NULL, 313, NULL, 293),
('bsu-s67', 2025, NULL, NULL, 331, NULL, 296)
ON CONFLICT DO NOTHING;

-- Факультет философии и социальных наук (bsu-14)
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s70', 2025, NULL, NULL, 368, NULL, 332),
('bsu-s71', 2025, NULL, NULL, 368, NULL, 347),
('bsu-s72', 2025, NULL, NULL, 373, NULL, 344),
('bsu-s73', 2025, NULL, NULL, 382, NULL, 357)
ON CONFLICT DO NOTHING;

-- Биологический факультет (bsu-9)
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s39', 2025, NULL, NULL, 326, NULL, 290),
('bsu-s41', 2025, NULL, NULL, 335, NULL, 304),
('bsu-s40', 2025, NULL, NULL, 355, NULL, 313),
('bsu-s42', 2025, NULL, NULL, 352, NULL, 325),
('bsu-s45', 2025, NULL, NULL, 354, NULL, 320),
('bsu-s44', 2025, NULL, NULL, 332, NULL, 314),
('bsu-s43', 2025, NULL, NULL, 321, NULL, 290)
ON CONFLICT DO NOTHING;

-- Институт теологии БГУ (bsu-i2)
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s87', 2025, NULL, NULL, 288, NULL, 313)
ON CONFLICT DO NOTHING;

-- МГЭИ (bsu-i3)
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s90', 2025, NULL, NULL, 271, NULL, NULL),
('bsu-s93', 2025, NULL, NULL, 272, NULL, NULL),
('bsu-s89', 2025, NULL, NULL, 288, NULL, NULL),
('bsu-s88', 2025, NULL, NULL, 294, NULL, 282),
('bsu-s91', 2025, NULL, NULL, 311, NULL, 271)
ON CONFLICT DO NOTHING;

-- Совместный институт БГУ и ДПУ (bsu-i4)
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s97', 2025, NULL, NULL, 367, NULL, 317),
('bsu-s95', 2025, NULL, NULL, 371, NULL, 302),
('bsu-s96', 2025, NULL, NULL, 353, NULL, NULL)
ON CONFLICT DO NOTHING;

-- Институт бизнеса БГУ (bsu-i1)
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
('bsu-s86', 2025, NULL, NULL, NULL, NULL, 320),
('bsu-s85', 2025, NULL, NULL, NULL, NULL, 318),
('bsu-s83', 2025, NULL, NULL, NULL, NULL, 346),
('bsu-s84', 2025, NULL, NULL, NULL, NULL, 312)
ON CONFLICT DO NOTHING;
