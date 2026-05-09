-- BNTU passing scores 2025
-- Sources: kudapostupat.by, priem.bntu.by, konsultant.by
-- Data actual after admission campaign 2025

DELETE FROM public.admission_stats WHERE specialty_id LIKE 'bntu-%' AND year = 2025;

INSERT INTO public.admission_stats (specialty_id, year, min_score, paid_min_score, budget_places, paid_places, avg_score) VALUES
-- Autotraktorny fakultet (ATF)
('bntu-s1', 2025, 222, 183, NULL, NULL, NULL),
('bntu-s2', 2025, 319, 253, NULL, NULL, NULL),
('bntu-s3', 2025, 206, 210, NULL, NULL, NULL),
('bntu-s4', 2025, 206, NULL, NULL, NULL, NULL),
('bntu-s6', 2025, 286, 252, NULL, NULL, NULL),
('bntu-s7', 2025, 253, NULL, NULL, NULL, NULL),
('bntu-s8', 2025, 180, NULL, NULL, NULL, NULL),
('bntu-s9', 2025, 277, 235, NULL, NULL, NULL),
('bntu-s10', 2025, 358, 294, NULL, NULL, NULL),
('bntu-s11', 2025, 287, NULL, NULL, NULL, NULL),

-- Fakultet gornogo dela i injenernoy ekologii (FGDiIE)
('bntu-s12', 2025, 202, NULL, NULL, NULL, NULL),
('bntu-s13', 2025, 220, 224, NULL, NULL, NULL),
('bntu-s14', 2025, 251, 256, NULL, NULL, NULL),

-- Mashinostroitelny fakultet (MSF)
('bntu-s15', 2025, 266, 208, NULL, NULL, NULL),
('bntu-s16', 2025, 215, 219, NULL, NULL, NULL),
('bntu-s17', 2025, 301, 182, NULL, NULL, NULL),
('bntu-s18', 2025, 173, 181, NULL, NULL, NULL),

-- Mehaniko-tehnologichesky fakultet (MTF)
('bntu-s19', 2025, 193, 174, NULL, NULL, NULL),
('bntu-s20', 2025, 186, 180, NULL, NULL, NULL),

-- FMMP
('bntu-s21', 2025, 382, 306, NULL, NULL, NULL),
('bntu-s22', 2025, 390, 333, NULL, NULL, NULL),
('bntu-s23', 2025, 346, 259, NULL, NULL, NULL),
('bntu-s24', 2025, 368, 301, NULL, NULL, NULL),
('bntu-s25', 2025, 244, 207, NULL, NULL, NULL),
('bntu-s26', 2025, 306, NULL, NULL, NULL, NULL),
('bntu-s27', 2025, 287, NULL, NULL, NULL, NULL),
('bntu-s28', 2025, 294, NULL, NULL, NULL, NULL),

-- Energetichesky fakultet (EnF)
('bntu-s29', 2025, 356, NULL, NULL, NULL, NULL),
('bntu-s291', 2025, 373, 265, NULL, NULL, NULL),
('bntu-s292', 2025, 350, 265, NULL, NULL, NULL),
('bntu-s30', 2025, 313, 261, NULL, NULL, NULL),
('bntu-s301', 2025, 313, 261, NULL, NULL, NULL),
('bntu-s302', 2025, 330, 261, NULL, NULL, NULL),
('bntu-s31', 2025, 361, 281, NULL, NULL, NULL),
('bntu-s32', 2025, 332, 252, NULL, NULL, NULL),

-- FITR
('bntu-s33', 2025, 361, 289, NULL, NULL, NULL),
('bntu-s34', 2025, 373, 320, NULL, NULL, NULL),
('bntu-s35', 2025, 324, 248, NULL, NULL, NULL),
('bntu-s36', 2025, 345, 273, NULL, NULL, NULL),

-- FTUG
('bntu-s37', 2025, 331, 273, NULL, NULL, NULL),
('bntu-s38', 2025, 310, 249, NULL, NULL, NULL),
('bntu-s39', 2025, 222, 183, NULL, NULL, NULL),
('bntu-s40', 2025, 189, 160, NULL, NULL, NULL),
('bntu-s41', 2025, 288, 213, NULL, NULL, NULL),

-- IPF
('bntu-s44', 2025, 189, 160, NULL, NULL, NULL),
('bntu-s45', 2025, 281, 209, NULL, NULL, NULL),

-- FES
('bntu-s47', 2025, 316, 258, NULL, NULL, NULL),
('bntu-s48', 2025, 319, 252, NULL, NULL, NULL),
('bntu-s49', 2025, 312, 228, NULL, NULL, NULL),

-- Arhitekturny fakultet (AF)
('bntu-s50', 2025, 303, 288, NULL, NULL, NULL),
('bntu-s51', 2025, 340, 264, NULL, NULL, NULL),

-- Stroitelny fakultet (SF)
('bntu-s52', 2025, 316, 262, NULL, NULL, NULL),
('bntu-s53', 2025, 328, 261, NULL, NULL, NULL),
('bntu-s54', 2025, 287, 222, NULL, NULL, NULL),

-- PSF
('bntu-s55', 2025, 302, 244, NULL, NULL, NULL),
('bntu-s56', 2025, 296, 237, NULL, NULL, NULL),
('bntu-s57', 2025, 258, 204, NULL, NULL, NULL),
('bntu-s58', 2025, 302, 234, NULL, NULL, NULL),
('bntu-s59', 2025, 320, 238, NULL, NULL, NULL),
('bntu-s60', 2025, 326, 249, NULL, NULL, NULL),
('bntu-s61', 2025, 316, 235, NULL, NULL, NULL),
('bntu-s62', 2025, 325, 249, NULL, NULL, NULL),

-- FTK
('bntu-s63', 2025, 253, 225, NULL, NULL, NULL),
('bntu-s64', 2025, 295, 238, NULL, NULL, NULL),
('bntu-s65', 2025, 308, 243, NULL, NULL, NULL),

-- VTF
('bntu-s66', 2025, 335, NULL, 3, NULL, NULL),
('bntu-s67', 2025, 208, 168, NULL, NULL, NULL),
('bntu-s68', 2025, 312, 250, NULL, NULL, NULL),

-- STF
('bntu-s69', 2025, 258, 204, NULL, NULL, NULL),

-- Soligorsk
('bntu-s70', 2025, 202, NULL, NULL, NULL, NULL),
('bntu-s71', 2025, 220, NULL, NULL, NULL, NULL),

-- MIDO
('bntu-s72', 2025, 306, 248, NULL, NULL, NULL),
('bntu-s73', 2025, 314, 276, NULL, NULL, NULL);

SELECT 'Added ' || COUNT(*) || ' records' as result FROM public.admission_stats WHERE specialty_id LIKE 'bntu-%' AND year = 2025;