-- Проходные баллы БГУ 2024 год
-- Выполнить в Supabase SQL Editor

-- ФПМИ
INSERT INTO public.admission_stats (specialty_id, year, passing_score_budget, passing_score_paid) VALUES
(61, 2024, 372, 346), (62, 2024, 391, 346), (63, 2024, 384, 348), (64, 2024, 378, 330);

-- ФРКТ
INSERT INTO public.admission_stats (specialty_id, year, passing_score_budget, passing_score_paid) VALUES
(65, 2024, 336, 295), (66, 2024, 344, 310), (67, 2024, 353, 321);

-- ЭФ
INSERT INTO public.admission_stats (specialty_id, year, passing_score_budget, passing_score_paid) VALUES
(70, 2024, 372, NULL), (71, 2024, 389, 296), (72, 2024, 377, 288),
(73, 2024, 381, 276), (74, 2024, 383, 321), (75, 2024, 394, 322);

-- ЮФ
INSERT INTO public.admission_stats (specialty_id, year, passing_score_budget, passing_score_paid) VALUES
(76, 2024, 350, 312), (77, 2024, 351, 319), (78, 2024, 355, 321);

-- ФилФ
INSERT INTO public.admission_stats (specialty_id, year, passing_score_budget, passing_score_paid) VALUES
(79, 2024, 361, 330), (80, 2024, 361, 296), (81, 2024, 312, NULL),
(82, 2024, 316, NULL), (83, 2024, 229, NULL);

-- ИстФ
INSERT INTO public.admission_stats (specialty_id, year, passing_score_budget, passing_score_paid) VALUES
(85, 2024, 341, 249), (86, 2024, 335, NULL), (87, 2024, 359, 229),
(88, 2024, 305, NULL), (89, 2024, 295, 232);

-- ХимФ
INSERT INTO public.admission_stats (specialty_id, year, passing_score_budget, passing_score_paid) VALUES
(90, 2024, 343, 318), (91, 2024, 372, 342), (92, 2024, 331, NULL),
(93, 2024, 333, NULL), (94, 2024, 333, NULL);

-- ФизФ
INSERT INTO public.admission_stats (specialty_id, year, passing_score_budget, passing_score_paid) VALUES
(95, 2024, 339, 293), (96, 2024, 321, NULL), (97, 2024, 335, NULL),
(98, 2024, 339, NULL), (99, 2024, 288, NULL);

-- БиоФ
INSERT INTO public.admission_stats (specialty_id, year, passing_score_budget, passing_score_paid) VALUES
(100, 2024, 333, 294), (101, 2024, 367, 324), (102, 2024, 347, 316),
(103, 2024, 364, 327), (104, 2024, 329, 287), (105, 2024, 349, 318);

-- ФМО
INSERT INTO public.admission_stats (specialty_id, year, passing_score_budget, passing_score_paid) VALUES
(107, 2024, 390, 323), (108, 2024, 381, 335), (109, 2024, 386, 333),
(110, 2024, 390, 343), (111, 2024, 382, 270), (112, 2024, 395, 310),
(113, 2024, 350, 284), (114, 2024, 369, 313);

-- ФСК
INSERT INTO public.admission_stats (specialty_id, year, passing_score_budget, passing_score_paid) VALUES
(116, 2024, 349, 267), (117, 2024, 357, 268), (118, 2024, 365, 283),
(119, 2024, 247, 211), (120, 2024, 358, 325), (121, 2024, 245, 217),
(122, 2024, 256, 214), (123, 2024, 246, NULL);

-- ФЖ
INSERT INTO public.admission_stats (specialty_id, year, passing_score_budget, passing_score_paid) VALUES
(124, 2024, 289, NULL), (125, 2024, 372, NULL);

-- ФГиГ
INSERT INTO public.admission_stats (specialty_id, year, passing_score_budget, passing_score_paid) VALUES
(126, 2024, 234, NULL), (127, 2024, 300, 263), (128, 2024, 236, 244),
(129, 2024, 298, 215), (130, 2024, 252, 258), (131, 2024, 273, 227),
(132, 2024, 330, 217), (133, 2024, 272, 143);

-- ФФиСН
INSERT INTO public.admission_stats (specialty_id, year, passing_score_budget, passing_score_paid) VALUES
(134, 2024, 349, 328), (135, 2024, 360, 324), (136, 2024, 364, 296),
(137, 2024, 383, 336);

-- ВФ
INSERT INTO public.admission_stats (specialty_id, year, passing_score_budget, passing_score_paid) VALUES
(138, 2024, 250, NULL), (139, 2024, 293, NULL), (140, 2024, 214, NULL),
(141, 2024, 356, NULL);

-- ММФ
INSERT INTO public.admission_stats (specialty_id, year, passing_score_budget, passing_score_paid) VALUES
(145, 2024, 329, NULL), (146, 2024, 349, NULL), (147, 2024, 359, 291),
(148, 2024, 364, 324);

-- Институты
INSERT INTO public.admission_stats (specialty_id, year, passing_score_budget, passing_score_paid) VALUES
(149, 2024, 275, 307), (150, 2024, 343, 287), (152, 2024, 356, 295);

-- МГЭИ
INSERT INTO public.admission_stats (specialty_id, year, passing_score_budget, passing_score_paid) VALUES
(161, 2024, 285, 274), (162, 2024, 278, NULL), (163, 2024, 245, NULL),
(164, 2024, 302, 189), (165, 2024, 228, NULL);

-- Проверка
SELECT 'Проходные баллы БГУ 2024 добавлены!' as status;
SELECT year, COUNT(*) as count FROM admission_stats WHERE year IN (2024, 2025) GROUP BY year ORDER BY year;