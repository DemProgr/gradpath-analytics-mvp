-- Юридический факультет (bsu-4) - 4 специальности за 2024

DELETE FROM public.admission_stats WHERE specialty_id IN ('bsu-s15', 'bsu-s16', 'bsu-s17') AND year = 2024;

INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
-- Политология - bsu-s17
('bsu-s17', 2024, NULL, NULL, NULL, NULL, 355),
-- Правоведение (сокращенный срок обучения) - bsu-s110
('bsu-s110', 2024, NULL, NULL, NULL, NULL, 230),
-- Правоведение - bsu-s16
('bsu-s16', 2024, NULL, NULL, NULL, NULL, 351),
-- Экономическое право - bsu-s15
('bsu-s15', 2024, NULL, NULL, NULL, NULL, 350);
