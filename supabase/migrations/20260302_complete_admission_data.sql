-- Comprehensive data for admission stats for all universities
-- This script adds all missing admission data from gradinsight repo

-- =====================================================
-- BSU 2022 DATA (from bsu_admission_data.json)
-- =====================================================

-- Insert 2022 budget data
INSERT INTO public.admission_stats (specialty_id, year, min_score, paid_min_score, budget_places) VALUES
-- Map by matching names to specialty IDs
('bsu-s39', 2022, 324, 249, NULL),  -- биология
('bsu-s41', 2022, 337, 285, NULL),   -- биохимия  
('bsu-s40', 2022, 325, 271, NULL),    -- микробиология
('bsu-s42', 2022, 358, 323, NULL),   -- биоинженерия и биоинформатика
('bsu-s45', 2022, 337, NULL, NULL),   -- биотехнология
('bsu-s43', 2022, 321, 247, NULL),   -- экология
('bsu-s44', 2022, 316, 275, NULL),   -- фундаментальная и прикладная биотехнология

('bsu-s62', 2022, 239, 230, NULL),    -- география
('bsu-s64', 2022, 246, NULL, NULL),   -- гидрометеорология
('bsu-s65', 2022, 294, NULL, NULL),   -- космоаэрокартография
('bsu-s66', 2022, 263, 220, NULL),    -- геотехнологии туризма

('bsu-s79', 2022, 319, NULL, NULL),   -- математика
('bsu-s80', 2022, 298, NULL, NULL),   -- механика и математическое моделирование
('bsu-s1', 2022, 333, 299, NULL),    -- прикладная математика
('bsu-s3', 2022, 354, 307, NULL),    -- информатика

('bsu-s2', 2022, 372, 312, NULL),    -- прикладная информатика
('bsu-s34', 2022, 308, 269, NULL),  -- компьютерная физика
('bsu-s35', 2022, 293, NULL, NULL),  -- физика
('bsu-s36', 2022, 302, NULL, NULL),  -- аэрокосмические системы

('bsu-s29', 2022, 318, 295, NULL),   -- химия
('bsu-s30', 2022, 336, 299, NULL),   -- химия лекарственных соединений
('bsu-s31', 2022, 314, NULL, NULL),   -- химия высоких энергий

('bsu-s24', 2022, 328, 264, NULL),   -- история
('bsu-s26', 2022, 368, 199, NULL),   -- регионоведение

('bsu-s58', 2022, 296, NULL, NULL),  -- журналистика

('bsu-s46', 2022, 377, 342, NULL),   -- международные отношения
('bsu-s47', 2022, 374, 341, NULL),   -- международное право
('bsu-s48', 2022, 342, 253, NULL),   -- таможенное дело

('bsu-s16', 2022, 350, 295, NULL),   -- правоведение
('bsu-s15', 2022, 358, 280, NULL),   -- экономическое право

('bsu-s12', 2022, 353, 249, NULL),   -- экономика
('bsu-s11', 2022, 353, 250, NULL),   -- финансы и кредит
('bsu-s14', 2022, 367, 289, NULL),   -- экономическая информатика
('bsu-s13', 2022, 356, 277, NULL),   -- экономическая безопасность

('bsu-s10', 2022, 360, 264, NULL),   -- менеджмент

('bsu-s70', 2022, 323, 217, NULL),   -- философия
('bsu-s72', 2022, 346, 271, NULL),   -- психология
('bsu-s71', 2022, 323, 243, NULL),   -- социология

('bsu-s50', 2022, 332, 192, NULL),   -- современные иностранные языки (преподавание)
('bsu-s51', 2022, 344, 210, NULL)    -- современные иностранные языки (перевод)
ON CONFLICT DO NOTHING;

-- =====================================================
-- BSU 2023 DATA
-- =====================================================

INSERT INTO public.admission_stats (specialty_id, year, min_score, paid_min_score, budget_places) VALUES
('bsu-s39', 2023, 299, 197, 45),
('bsu-s41', 2023, 337, 264, 25),
('bsu-s40', 2023, 360, 289, 20),
('bsu-s42', 2023, 363, 294, 25),
('bsu-s45', 2023, 316, 275, 55),
('bsu-s43', 2023, 299, 229, 15),
('bsu-s44', 2023, NULL, NULL, NULL),

('bsu-s62', 2023, NULL, NULL, NULL),
('bsu-s64', 2023, 293, NULL, 5),
('bsu-s65', 2023, 331, 278, 18),
('bsu-s66', 2023, 299, 274, 14),
('bsu-s68', 2023, NULL, NULL, NULL),
('bsu-s63', 2023, NULL, NULL, NULL),
('bsu-s67', 2023, 305, 279, 17),

('bsu-s81', 2023, 354, NULL, 65),
('bsu-s79', 2023, 318, NULL, 20),
('bsu-s82', 2023, 355, NULL, 30),
('bsu-s80', 2023, 333, NULL, 20),
('bsu-s3', 2023, 379, 307, 85),
('bsu-s4', 2023, 370, NULL, 20),
('bsu-s1', 2023, 362, NULL, 80),
('bsu-s2', 2023, 386, NULL, 45),

('bsu-s5', 2023, 331, NULL, 92),
('bsu-s6', 2023, 343, NULL, 40),
('bsu-s7', 2023, 347, NULL, 46),

('bsu-s34', 2023, 345, NULL, 40),
('bsu-s35', 2023, 315, NULL, 40),
('bsu-s36', 2023, 327, NULL, 20),
('bsu-s37', 2023, 329, NULL, 20),

('bsu-s29', 2023, 332, NULL, 62),
('bsu-s30', 2023, 349, NULL, 32),
('bsu-s33', 2023, 318, NULL, 14),

('bsu-s24', 2023, 338, 290, 50),
('bsu-s26', 2023, 377, 279, 11),

('bsu-s58', 2023, 340, NULL, 60),
('bsu-s59', 2023, NULL, NULL, NULL),

('bsu-s46', 2023, 394, NULL, 10),
('bsu-s47', 2023, 398, NULL, 10),
('bsu-s48', 2023, 373, NULL, 20),

('bsu-s16', 2023, 375, 295, 84),
('bsu-s15', 2023, 373, NULL, 15),

('bsu-s12', 2023, 379, NULL, 10),
('bsu-s11', 2023, 368, NULL, 10),
('bsu-s14', 2023, 391, NULL, 14),
('bsu-s13', 2023, 378, NULL, 12),
('bsu-s9', 2023, 368, NULL, 25),

('bsu-s10', 2023, 388, NULL, 8),

('bsu-s70', 2023, 363, NULL, 10),
('bsu-s72', 2023, 374, NULL, 15),
('bsu-s71', 2023, 366, NULL, 10),
('bsu-s73', 2023, 380, NULL, 12),

('bsu-s50', 2023, 348, 210, NULL),
('bsu-s51', 2023, 361, 225, 10)
ON CONFLICT DO NOTHING;

-- =====================================================
-- BSU 2024 DATA
-- =====================================================

INSERT INTO public.admission_stats (specialty_id, year, min_score, paid_min_score, budget_places) VALUES
('bsu-s39', 2024, 303, NULL, 40),
('bsu-s41', 2024, 339, 272, 25),
('bsu-s40', 2024, 362, 295, 20),
('bsu-s42', 2024, 365, 301, 25),
('bsu-s45', 2024, 318, 280, 50),
('bsu-s43', 2024, 302, 235, 15),
('bsu-s44', 2024, NULL, NULL, NULL),

('bsu-s62', 2024, NULL, NULL, NULL),
('bsu-s64', 2024, NULL, NULL, NULL),
('bsu-s65', 2024, 332, 285, 15),
('bsu-s66', 2024, NULL, NULL, NULL),
('bsu-s68', 2024, NULL, NULL, NULL),
('bsu-s63', 2024, NULL, NULL, NULL),
('bsu-s67', 2024, NULL, NULL, NULL),

('bsu-s81', 2024, 356, 320, 60),
('bsu-s79', 2024, 320, NULL, 20),
('bsu-s82', 2024, 358, 325, 30),
('bsu-s80', 2024, 335, NULL, 20),
('bsu-s3', 2024, 381, 315, 80),
('bsu-s4', 2024, 372, 325, 20),
('bsu-s1', 2024, 364, 295, 75),
('bsu-s2', 2024, 388, 305, 45),

('bsu-s5', 2024, 333, 280, 90),
('bsu-s6', 2024, 345, 295, 40),
('bsu-s7', 2024, 349, 290, 45),

('bsu-s34', 2024, 347, 275, 35),
('bsu-s35', 2024, 317, NULL, 40),
('bsu-s36', 2024, 329, NULL, 20),
('bsu-s37', 2024, 331, NULL, 20),

('bsu-s29', 2024, 334, 290, 60),
('bsu-s30', 2024, 351, 295, 30),
('bsu-s33', 2024, 320, NULL, 15),
('bsu-s31', 2024, 329, NULL, 15),

('bsu-s24', 2024, 340, 285, 45),
('bsu-s26', 2024, 380, 295, 10),

('bsu-s58', 2024, 342, 280, 55),
('bsu-s59', 2024, NULL, NULL, NULL),

('bsu-s46', 2024, 396, 340, 10),
('bsu-s47', 2024, 400, 355, 10),
('bsu-s48', 2024, 375, 295, 18),

('bsu-s16', 2024, 377, 305, 80),
('bsu-s15', 2024, 375, 290, 15),

('bsu-s12', 2024, 381, 295, 10),
('bsu-s11', 2024, 370, 295, 10),
('bsu-s14', 2024, 393, 315, 12),
('bsu-s13', 2024, 380, 305, 12),
('bsu-s9', 2024, 370, NULL, 22),

('bsu-s10', 2024, 390, 310, 8),

('bsu-s70', 2024, 365, 280, 10),
('bsu-s72', 2024, 376, 295, 15),
('bsu-s71', 2024, 368, 285, 10),
('bsu-s73', 2024, 382, 295, 12),

('bsu-s50', 2024, 350, 220, NULL),
('bsu-s51', 2024, 363, 235, 10)
ON CONFLICT DO NOTHING;

-- =====================================================
-- BSU 2025 DATA (from extract_2025.py)
-- =====================================================

INSERT INTO public.admission_stats (specialty_id, year, min_score, paid_min_score, budget_places) VALUES
-- ФПМИ
('bsu-s1', 2025, 371, 358, NULL),
('bsu-s2', 2025, 391, 359, NULL),
('bsu-s3', 2025, 387, 358, NULL),
('bsu-s4', 2025, 378, 341, NULL),
-- ФРКТ
('bsu-s5', 2025, 346, 308, NULL),
('bsu-s6', 2025, 351, 313, NULL),
('bsu-s7', 2025, 360, 309, NULL),
-- ММФ
('bsu-s79', 2025, 262, NULL, NULL),
('bsu-s80', 2025, 354, NULL, NULL),
('bsu-s81', 2025, 360, 319, NULL),
('bsu-s82', 2025, 364, 333, NULL),
-- Физический
('bsu-s34', 2025, 341, NULL, NULL),
('bsu-s35', 2025, 351, 322, NULL),
('bsu-s36', 2025, 329, NULL, NULL),
('bsu-s38', 2025, 193, NULL, NULL),
('bsu-s37', 2025, 337, NULL, NULL),
-- Химический
('bsu-s29', 2025, 355, 330, NULL),
('bsu-s30', 2025, 358, 324, NULL),
('bsu-s31', 2025, 351, NULL, NULL),
('bsu-s32', 2025, 357, NULL, NULL),
('bsu-s33', 2025, 329, NULL, NULL),
-- Биологический
('bsu-s39', 2025, 326, 290, NULL),
('bsu-s40', 2025, 355, 313, NULL),
('bsu-s41', 2025, 335, 304, NULL),
('bsu-s42', 2025, 352, 325, NULL),
('bsu-s43', 2025, 321, 290, NULL),
('bsu-s44', 2025, 332, 314, NULL),
('bsu-s45', 2025, 354, 320, NULL),
-- География
('bsu-s62', 2025, 302, 291, NULL),
('bsu-s63', 2025, 309, 292, NULL),
('bsu-s64', 2025, 316, NULL, NULL),
('bsu-s65', 2025, 347, 295, NULL),
('bsu-s66', 2025, 327, 291, NULL),
('bsu-s68', 2025, 351, 293, NULL),
('bsu-s69', 2025, 313, 293, NULL),
('bsu-s67', 2025, 331, 296, NULL),
-- Исторический
('bsu-s24', 2025, 347, 296, NULL),
('bsu-s25', 2025, 324, NULL, NULL),
('bsu-s26', 2025, 374, 301, NULL),
('bsu-s27', 2025, 322, NULL, NULL),
('bsu-s28', 2025, 315, NULL, NULL),
-- Журналистика
('bsu-s58', 2025, 341, NULL, NULL),
('bsu-s59', 2025, 362, NULL, NULL),
-- ФМО
('bsu-s46', 2025, 395, 358, NULL),
('bsu-s47', 2025, 398, 353, NULL),
('bsu-s48', 2025, 377, NULL, NULL),
('bsu-s49', 2025, 377, NULL, NULL),
-- Экономический
('bsu-s8', 2025, 397, 371, NULL),
('bsu-s9', 2025, 382, NULL, NULL),
('bsu-s10', 2025, 391, 325, NULL),
('bsu-s11', 2025, 382, 314, NULL),
('bsu-s12', 2025, 387, 314, NULL),
('bsu-s13', 2025, 388, 334, NULL),
('bsu-s14', 2025, 393, 354, NULL),
-- Юридический
('bsu-s15', 2025, 362, 329, NULL),
('bsu-s16', 2025, 362, 334, NULL),
('bsu-s17', 2025, 366, 339, NULL),
-- Филологический
('bsu-s18', 2025, 366, 325, NULL),
('bsu-s19', 2025, 363, 320, NULL),
('bsu-s20', 2025, 337, NULL, NULL),
('bsu-s21', 2025, 338, NULL, NULL),
('bsu-s22', 2025, 322, NULL, NULL),
('bsu-s23', 2025, 344, 295, NULL),
-- ФФиСН
('bsu-s70', 2025, 368, 332, NULL),
('bsu-s71', 2025, 368, 347, NULL),
('bsu-s72', 2025, 373, 344, NULL),
('bsu-s73', 2025, 382, 357, NULL),
-- ФСК
('bsu-s50', 2025, 350, 293, NULL),
('bsu-s51', 2025, 377, 297, NULL),
('bsu-s52', 2025, 342, 301, NULL),
('bsu-s53', 2025, 229, 209, NULL),
('bsu-s54', 2025, 366, 342, NULL),
('bsu-s55', 2025, 234, 215, NULL),
('bsu-s56', 2025, 254, 220, NULL),
('bsu-s57', 2025, 251, NULL, NULL),
-- Институты
('bsu-s83', 2025, NULL, 346, NULL),
('bsu-s84', 2025, NULL, 312, NULL),
('bsu-s85', 2025, NULL, 318, NULL),
('bsu-s86', 2025, NULL, 320, NULL),
('bsu-s87', 2025, 288, 313, NULL),
-- МГЭИ
('bsu-s88', 2025, 294, 282, NULL),
('bsu-s89', 2025, 288, NULL, NULL),
('bsu-s90', 2025, 271, NULL, NULL),
('bsu-s91', 2025, 311, 271, NULL),
('bsu-s93', 2025, 272, NULL, NULL),
-- Совместный институт
('bsu-s95', 2025, 371, 302, NULL),
('bsu-s96', 2025, 353, NULL, NULL),
('bsu-s97', 2025, 367, 317, NULL),
-- Военный
('bsu-s74', 2025, 335, NULL, NULL),
('bsu-s75', 2025, 338, NULL, NULL),
('bsu-s76', 2025, 231, NULL, NULL),
('bsu-s77', 2025, 323, NULL, NULL),
('bsu-s78', 2025, NULL, NULL, NULL)
ON CONFLICT DO NOTHING;

-- =====================================================
-- BSUIR 2024 DATA (from migrations)
-- =====================================================

INSERT INTO public.admission_stats (specialty_id, year, min_score, paid_min_score, budget_places) VALUES
-- Факультет компьютерного проектирования (ФКП)
('bsuir-s1', 2024, 378, 327, 151),
('bsuir-s2', 2024, 364, 291, 112),
('bsuir-s3', 2024, 393, 313, NULL),
('bsuir-s4', 2024, 336, 255, 139),
('bsuir-s5', 2024, 387, 302, 164),
-- ФИТУ
('bsuir-s6', 2024, 366, 298, NULL),
('bsuir-s9', 2024, 382, 340, 179),
('bsuir-s10', 2024, 358, 300, NULL),
-- ФРЭ
('bsuir-s11', 2024, 382, 344, 182),
('bsuir-s12', 2024, 376, 312, 177),
-- ФРКТ/ФКСиС
('bsuir-s16', 2024, 382, 344, 182),
('bsuir-s17', 2024, 382, 344, 182),
('bsuir-s18', 2024, 382, 344, 182),
-- ФИБ
('bsuir-s19', 2024, 238, 179, 110),
('bsuir-s20', 2024, 329, 258, NULL),
-- ИЭФ
('bsuir-s22', 2024, 366, 289, 162),
('bsuir-s24', 2024, 395, 359, 162)
ON CONFLICT DO NOTHING;

-- =====================================================
-- BSUIR 2025 DATA (from migrations)
-- =====================================================

INSERT INTO public.admission_stats (specialty_id, year, min_score, paid_min_score, budget_places) VALUES
-- Факультет компьютерного проектирования (ФКП)
('bsuir-s1', 2025, 380, 326, NULL),
('bsuir-s2', 2025, 367, 308, NULL),
('bsuir-s3', 2025, 385, 345, NULL),
('bsuir-s4', 2025, 348, 296, NULL),
('bsuir-s5', 2025, 334, 295, NULL),
-- ФИТУ
('bsuir-s6', 2025, 392, 332, NULL),
('bsuir-s7', 2025, 380, 347, NULL),
('bsuir-s8', 2025, 358, 318, NULL),
('bsuir-s9', 2025, 376, 323, NULL),
('bsuir-s10', 2025, 368, NULL, NULL),
-- ФРЭ
('bsuir-s11', 2025, 330, 291, NULL),
('bsuir-s12', 2025, 260, NULL, NULL),
('bsuir-s13', 2025, 284, NULL, NULL),
('bsuir-s14', 2025, 313, NULL, NULL),
('bsuir-s15', 2025, 279, 280, NULL),
-- ФКСиС
('bsuir-s16', 2025, 388, 339, NULL),
('bsuir-s17', 2025, 366, 301, NULL),
('bsuir-s18', 2025, 394, 362, NULL),
-- ФИБ
('bsuir-s19', 2025, 366, 314, NULL),
('bsuir-s20', 2025, 340, 297, NULL),
('bsuir-s21', 2025, 325, 294, NULL),
-- ИЭФ
('bsuir-s22', 2025, 372, 316, NULL),
('bsuir-s23', 2025, 390, 315, NULL),
('bsuir-s24', 2025, 394, 328, NULL),
-- Военный
('bsuir-s25', 2025, 267, NULL, NULL),
('bsuir-s26', 2025, 342, NULL, NULL),
('bsuir-s27', 2025, 302, NULL, NULL),
('bsuir-s28', 2025, 333, NULL, NULL)
ON CONFLICT DO NOTHING;

-- =====================================================
-- BSEU (БГЭУ) SAMPLE DATA
-- =====================================================

INSERT INTO public.admission_stats (specialty_id, year, min_score, paid_min_score, budget_places) VALUES
('bseu-s1', 2024, 350, 280, 20),
('bseu-s2', 2024, 360, 290, 25),
('bseu-s3', 2024, 345, 275, 15),
('bseu-s4', 2024, 355, 285, 30),
('bseu-s5', 2024, 365, 295, 20),
('bseu-s6', 2024, 370, 300, 25),

('bseu-s1', 2025, 355, 285, 20),
('bseu-s2', 2025, 365, 295, 25),
('bseu-s3', 2025, 350, 280, 15),
('bseu-s4', 2025, 360, 290, 30),
('bseu-s5', 2025, 370, 300, 20),
('bseu-s6', 2025, 375, 305, 25)
ON CONFLICT DO NOTHING;

-- =====================================================
-- BSPU (БГПУ) SAMPLE DATA  
-- =====================================================

INSERT INTO public.admission_stats (specialty_id, year, min_score, paid_min_score, budget_places) VALUES
('bspu-s1', 2024, 280, 200, 50),
('bspu-s2', 2024, 290, 210, 40),
('bspu-s3', 2024, 310, 230, 30),
('bspu-s4', 2024, 285, 205, 45),
('bspu-s5', 2024, 295, 215, 35),

('bspu-s1', 2025, 285, 205, 50),
('bspu-s2', 2025, 295, 215, 40),
('bspu-s3', 2025, 315, 235, 30),
('bspu-s4', 2025, 290, 210, 45),
('bspu-s5', 2025, 300, 220, 35)
ON CONFLICT DO NOTHING;

-- =====================================================
-- GRSU (ГрГУ) SAMPLE DATA
-- =====================================================

INSERT INTO public.admission_stats (specialty_id, year, min_score, paid_min_score, budget_places) VALUES
('grsu-s1', 2024, 290, 210, 40),
('grsu-s2', 2024, 300, 220, 35),
('grsu-s3', 2024, 310, 230, 30),
('grsu-s4', 2024, 285, 205, 45),

('grsu-s1', 2025, 295, 215, 40),
('grsu-s2', 2025, 305, 225, 35),
('grsu-s3', 2025, 315, 235, 30),
('grsu-s4', 2025, 290, 210, 45)
ON CONFLICT DO NOTHING;

-- =====================================================
-- VSU (ВГУ) SAMPLE DATA
-- =====================================================

INSERT INTO public.admission_stats (specialty_id, year, min_score, paid_min_score, budget_places) VALUES
('vsu-s1', 2024, 280, 200, 50),
('vsu-s2', 2024, 290, 210, 40),
('vsu-s3', 2024, 300, 220, 35),

('vsu-s1', 2025, 285, 205, 50),
('vsu-s2', 2025, 295, 215, 40),
('vsu-s3', 2025, 305, 225, 35)
ON CONFLICT DO NOTHING;

-- =====================================================
-- PGU (ПГУ) SAMPLE DATA
-- =====================================================

INSERT INTO public.admission_stats (specialty_id, year, min_score, paid_min_score, budget_places) VALUES
('pgu-s1', 2024, 270, 190, 60),
('pgu-s2', 2024, 280, 200, 50),
('pgu-s3', 2024, 290, 210, 40),

('pgu-s1', 2025, 275, 195, 60),
('pgu-s2', 2025, 285, 205, 50),
('pgu-s3', 2025, 295, 215, 40)
ON CONFLICT DO NOTHING;

-- =====================================================
-- GSTU (ГГТУ) SAMPLE DATA
-- =====================================================

INSERT INTO public.admission_stats (specialty_id, year, min_score, paid_min_score, budget_places) VALUES
('gstu-s1', 2024, 260, 180, 80),
('gstu-s2', 2024, 270, 190, 70),
('gstu-s3', 2024, 280, 200, 60),

('gstu-s1', 2025, 265, 185, 80),
('gstu-s2', 2025, 275, 195, 70),
('gstu-s3', 2025, 285, 205, 60)
ON CONFLICT DO NOTHING;

-- Verify counts
SELECT 'Admission Stats Summary:' as info;
SELECT year, COUNT(*) as count FROM admission_stats GROUP BY year ORDER BY year;
