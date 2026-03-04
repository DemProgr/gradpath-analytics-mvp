const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nwfqpaicjpinfwoenlkg.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53ZnFwYWljanBpbmZ3b2VubGtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDY1OTQ1MywiZXhwIjoyMDg2MjM1NDUzfQ.Wf8tPIHyN63Qn_yFFeKa3drcc_G03vlb2WQ9d9eyIeM';

const supabase = createClient(supabaseUrl, serviceRoleKey);

const bsu2022Data = [
  { specialty_id: 'bsu-s39', year: 2022, min_score: 324, paid_min_score: 249 },
  { specialty_id: 'bsu-s41', year: 2022, min_score: 337, paid_min_score: 285 },
  { specialty_id: 'bsu-s40', year: 2022, min_score: 325, paid_min_score: 271 },
  { specialty_id: 'bsu-s42', year: 2022, min_score: 358, paid_min_score: 323 },
  { specialty_id: 'bsu-s45', year: 2022, min_score: 337, paid_min_score: null },
  { specialty_id: 'bsu-s43', year: 2022, min_score: 321, paid_min_score: 247 },
  { specialty_id: 'bsu-s44', year: 2022, min_score: 316, paid_min_score: 275 },
  { specialty_id: 'bsu-s62', year: 2022, min_score: 239, paid_min_score: 230 },
  { specialty_id: 'bsu-s64', year: 2022, min_score: 246, paid_min_score: null },
  { specialty_id: 'bsu-s65', year: 2022, min_score: 294, paid_min_score: null },
  { specialty_id: 'bsu-s66', year: 2022, min_score: 263, paid_min_score: 220 },
  { specialty_id: 'bsu-s79', year: 2022, min_score: 319, paid_min_score: null },
  { specialty_id: 'bsu-s80', year: 2022, min_score: 298, paid_min_score: null },
  { specialty_id: 'bsu-s1', year: 2022, min_score: 333, paid_min_score: 299 },
  { specialty_id: 'bsu-s3', year: 2022, min_score: 354, paid_min_score: 307 },
  { specialty_id: 'bsu-s2', year: 2022, min_score: 372, paid_min_score: 312 },
  { specialty_id: 'bsu-s34', year: 2022, min_score: 308, paid_min_score: 269 },
  { specialty_id: 'bsu-s35', year: 2022, min_score: 293, paid_min_score: null },
  { specialty_id: 'bsu-s36', year: 2022, min_score: 302, paid_min_score: null },
  { specialty_id: 'bsu-s29', year: 2022, min_score: 318, paid_min_score: 295 },
  { specialty_id: 'bsu-s30', year: 2022, min_score: 336, paid_min_score: 299 },
  { specialty_id: 'bsu-s31', year: 2022, min_score: 314, paid_min_score: null },
  { specialty_id: 'bsu-s24', year: 2022, min_score: 328, paid_min_score: 264 },
  { specialty_id: 'bsu-s26', year: 2022, min_score: 368, paid_min_score: 199 },
  { specialty_id: 'bsu-s58', year: 2022, min_score: 296, paid_min_score: null },
  { specialty_id: 'bsu-s46', year: 2022, min_score: 377, paid_min_score: 342 },
  { specialty_id: 'bsu-s47', year: 2022, min_score: 374, paid_min_score: 341 },
  { specialty_id: 'bsu-s48', year: 2022, min_score: 342, paid_min_score: 253 },
  { specialty_id: 'bsu-s16', year: 2022, min_score: 350, paid_min_score: 295 },
  { specialty_id: 'bsu-s15', year: 2022, min_score: 358, paid_min_score: 280 },
  { specialty_id: 'bsu-s12', year: 2022, min_score: 353, paid_min_score: 249 },
  { specialty_id: 'bsu-s11', year: 2022, min_score: 353, paid_min_score: 250 },
  { specialty_id: 'bsu-s14', year: 2022, min_score: 367, paid_min_score: 289 },
  { specialty_id: 'bsu-s13', year: 2022, min_score: 356, paid_min_score: 277 },
  { specialty_id: 'bsu-s10', year: 2022, min_score: 360, paid_min_score: 264 },
  { specialty_id: 'bsu-s70', year: 2022, min_score: 323, paid_min_score: 217 },
  { specialty_id: 'bsu-s72', year: 2022, min_score: 346, paid_min_score: 271 },
  { specialty_id: 'bsu-s71', year: 2022, min_score: 323, paid_min_score: 243 },
  { specialty_id: 'bsu-s50', year: 2022, min_score: 332, paid_min_score: 192 },
  { specialty_id: 'bsu-s51', year: 2022, min_score: 344, paid_min_score: 210 },
];

const bsu2023Data = [
  { specialty_id: 'bsu-s39', year: 2023, min_score: 299, paid_min_score: 197, budget_places: 45 },
  { specialty_id: 'bsu-s41', year: 2023, min_score: 337, paid_min_score: 264, budget_places: 25 },
  { specialty_id: 'bsu-s40', year: 2023, min_score: 360, paid_min_score: 289, budget_places: 20 },
  { specialty_id: 'bsu-s42', year: 2023, min_score: 363, paid_min_score: 294, budget_places: 25 },
  { specialty_id: 'bsu-s45', year: 2023, min_score: 316, paid_min_score: 275, budget_places: 55 },
  { specialty_id: 'bsu-s43', year: 2023, min_score: 299, paid_min_score: 229, budget_places: 15 },
  { specialty_id: 'bsu-s81', year: 2023, min_score: 354, paid_min_score: null, budget_places: 65 },
  { specialty_id: 'bsu-s79', year: 2023, min_score: 318, paid_min_score: null, budget_places: 20 },
  { specialty_id: 'bsu-s82', year: 2023, min_score: 355, paid_min_score: null, budget_places: 30 },
  { specialty_id: 'bsu-s80', year: 2023, min_score: 333, paid_min_score: null, budget_places: 20 },
  { specialty_id: 'bsu-s3', year: 2023, min_score: 379, paid_min_score: 307, budget_places: 85 },
  { specialty_id: 'bsu-s4', year: 2023, min_score: 370, paid_min_score: null, budget_places: 20 },
  { specialty_id: 'bsu-s1', year: 2023, min_score: 362, paid_min_score: null, budget_places: 80 },
  { specialty_id: 'bsu-s2', year: 2023, min_score: 386, paid_min_score: null, budget_places: 45 },
  { specialty_id: 'bsu-s5', year: 2023, min_score: 331, paid_min_score: null, budget_places: 92 },
  { specialty_id: 'bsu-s6', year: 2023, min_score: 343, paid_min_score: null, budget_places: 40 },
  { specialty_id: 'bsu-s7', year: 2023, min_score: 347, paid_min_score: null, budget_places: 46 },
  { specialty_id: 'bsu-s34', year: 2023, min_score: 345, paid_min_score: null, budget_places: 40 },
  { specialty_id: 'bsu-s35', year: 2023, min_score: 315, paid_min_score: null, budget_places: 40 },
  { specialty_id: 'bsu-s36', year: 2023, min_score: 327, paid_min_score: null, budget_places: 20 },
  { specialty_id: 'bsu-s37', year: 2023, min_score: 329, paid_min_score: null, budget_places: 20 },
  { specialty_id: 'bsu-s29', year: 2023, min_score: 332, paid_min_score: null, budget_places: 62 },
  { specialty_id: 'bsu-s30', year: 2023, min_score: 349, paid_min_score: null, budget_places: 32 },
  { specialty_id: 'bsu-s33', year: 2023, min_score: 318, paid_min_score: null, budget_places: 14 },
  { specialty_id: 'bsu-s24', year: 2023, min_score: 338, paid_min_score: 290, budget_places: 50 },
  { specialty_id: 'bsu-s26', year: 2023, min_score: 377, paid_min_score: 279, budget_places: 11 },
  { specialty_id: 'bsu-s58', year: 2023, min_score: 340, paid_min_score: null, budget_places: 60 },
  { specialty_id: 'bsu-s46', year: 2023, min_score: 394, paid_min_score: null, budget_places: 10 },
  { specialty_id: 'bsu-s47', year: 2023, min_score: 398, paid_min_score: null, budget_places: 10 },
  { specialty_id: 'bsu-s48', year: 2023, min_score: 373, paid_min_score: null, budget_places: 20 },
  { specialty_id: 'bsu-s16', year: 2023, min_score: 375, paid_min_score: 295, budget_places: 84 },
  { specialty_id: 'bsu-s15', year: 2023, min_score: 373, paid_min_score: null, budget_places: 15 },
  { specialty_id: 'bsu-s12', year: 2023, min_score: 379, paid_min_score: null, budget_places: 10 },
  { specialty_id: 'bsu-s11', year: 2023, min_score: 368, paid_min_score: null, budget_places: 10 },
  { specialty_id: 'bsu-s14', year: 2023, min_score: 391, paid_min_score: null, budget_places: 14 },
  { specialty_id: 'bsu-s13', year: 2023, min_score: 378, paid_min_score: null, budget_places: 12 },
  { specialty_id: 'bsu-s9', year: 2023, min_score: 368, paid_min_score: null, budget_places: 25 },
  { specialty_id: 'bsu-s10', year: 2023, min_score: 388, paid_min_score: null, budget_places: 8 },
  { specialty_id: 'bsu-s70', year: 2023, min_score: 363, paid_min_score: null, budget_places: 10 },
  { specialty_id: 'bsu-s72', year: 2023, min_score: 374, paid_min_score: null, budget_places: 15 },
  { specialty_id: 'bsu-s71', year: 2023, min_score: 366, paid_min_score: null, budget_places: 10 },
  { specialty_id: 'bsu-s73', year: 2023, min_score: 380, paid_min_score: null, budget_places: 12 },
  { specialty_id: 'bsu-s50', year: 2023, min_score: 348, paid_min_score: 210, budget_places: null },
  { specialty_id: 'bsu-s51', year: 2023, min_score: 361, paid_min_score: 225, budget_places: 10 },
];

const bsu2024Data = [
  { specialty_id: 'bsu-s39', year: 2024, min_score: 303, paid_min_score: null, budget_places: 40 },
  { specialty_id: 'bsu-s41', year: 2024, min_score: 339, paid_min_score: 272, budget_places: 25 },
  { specialty_id: 'bsu-s40', year: 2024, min_score: 362, paid_min_score: 295, budget_places: 20 },
  { specialty_id: 'bsu-s42', year: 2024, min_score: 365, paid_min_score: 301, budget_places: 25 },
  { specialty_id: 'bsu-s45', year: 2024, min_score: 318, paid_min_score: 280, budget_places: 50 },
  { specialty_id: 'bsu-s43', year: 2024, min_score: 302, paid_min_score: 235, budget_places: 15 },
  { specialty_id: 'bsu-s81', year: 2024, min_score: 356, paid_min_score: 320, budget_places: 60 },
  { specialty_id: 'bsu-s79', year: 2024, min_score: 320, paid_min_score: null, budget_places: 20 },
  { specialty_id: 'bsu-s82', year: 2024, min_score: 358, paid_min_score: 325, budget_places: 30 },
  { specialty_id: 'bsu-s80', year: 2024, min_score: 335, paid_min_score: null, budget_places: 20 },
  { specialty_id: 'bsu-s3', year: 2024, min_score: 381, paid_min_score: 315, budget_places: 80 },
  { specialty_id: 'bsu-s4', year: 2024, min_score: 372, paid_min_score: 325, budget_places: 20 },
  { specialty_id: 'bsu-s1', year: 2024, min_score: 364, paid_min_score: 295, budget_places: 75 },
  { specialty_id: 'bsu-s2', year: 2024, min_score: 388, paid_min_score: 305, budget_places: 45 },
  { specialty_id: 'bsu-s5', year: 2024, min_score: 333, paid_min_score: 280, budget_places: 90 },
  { specialty_id: 'bsu-s6', year: 2024, min_score: 345, paid_min_score: 295, budget_places: 40 },
  { specialty_id: 'bsu-s7', year: 2024, min_score: 349, paid_min_score: 290, budget_places: 45 },
  { specialty_id: 'bsu-s34', year: 2024, min_score: 347, paid_min_score: 275, budget_places: 35 },
  { specialty_id: 'bsu-s35', year: 2024, min_score: 317, paid_min_score: null, budget_places: 40 },
  { specialty_id: 'bsu-s36', year: 2024, min_score: 329, paid_min_score: null, budget_places: 20 },
  { specialty_id: 'bsu-s37', year: 2024, min_score: 331, paid_min_score: null, budget_places: 20 },
  { specialty_id: 'bsu-s29', year: 2024, min_score: 334, paid_min_score: 290, budget_places: 60 },
  { specialty_id: 'bsu-s30', year: 2024, min_score: 351, paid_min_score: 295, budget_places: 30 },
  { specialty_id: 'bsu-s33', year: 2024, min_score: 320, paid_min_score: null, budget_places: 15 },
  { specialty_id: 'bsu-s31', year: 2024, min_score: 329, paid_min_score: null, budget_places: 15 },
  { specialty_id: 'bsu-s24', year: 2024, min_score: 340, paid_min_score: 285, budget_places: 45 },
  { specialty_id: 'bsu-s26', year: 2024, min_score: 380, paid_min_score: 295, budget_places: 10 },
  { specialty_id: 'bsu-s58', year: 2024, min_score: 342, paid_min_score: 280, budget_places: 55 },
  { specialty_id: 'bsu-s46', year: 2024, min_score: 396, paid_min_score: 340, budget_places: 10 },
  { specialty_id: 'bsu-s47', year: 2024, min_score: 400, paid_min_score: 355, budget_places: 10 },
  { specialty_id: 'bsu-s48', year: 2024, min_score: 375, paid_min_score: 295, budget_places: 18 },
  { specialty_id: 'bsu-s16', year: 2024, min_score: 377, paid_min_score: 305, budget_places: 80 },
  { specialty_id: 'bsu-s15', year: 2024, min_score: 375, paid_min_score: 290, budget_places: 15 },
  { specialty_id: 'bsu-s12', year: 2024, min_score: 381, paid_min_score: 295, budget_places: 10 },
  { specialty_id: 'bsu-s11', year: 2024, min_score: 370, paid_min_score: 295, budget_places: 10 },
  { specialty_id: 'bsu-s14', year: 2024, min_score: 393, paid_min_score: 315, budget_places: 12 },
  { specialty_id: 'bsu-s13', year: 2024, min_score: 380, paid_min_score: 305, budget_places: 12 },
  { specialty_id: 'bsu-s9', year: 2024, min_score: 370, paid_min_score: null, budget_places: 22 },
  { specialty_id: 'bsu-s10', year: 2024, min_score: 390, paid_min_score: 310, budget_places: 8 },
  { specialty_id: 'bsu-s70', year: 2024, min_score: 365, paid_min_score: 280, budget_places: 10 },
  { specialty_id: 'bsu-s72', year: 2024, min_score: 376, paid_min_score: 295, budget_places: 15 },
  { specialty_id: 'bsu-s71', year: 2024, min_score: 368, paid_min_score: 285, budget_places: 10 },
  { specialty_id: 'bsu-s73', year: 2024, min_score: 382, paid_min_score: 295, budget_places: 12 },
  { specialty_id: 'bsu-s50', year: 2024, min_score: 350, paid_min_score: 220, budget_places: null },
  { specialty_id: 'bsu-s51', year: 2024, min_score: 363, paid_min_score: 235, budget_places: 10 },
];

const bsu2025Data = [
  { specialty_id: 'bsu-s1', year: 2025, min_score: 371, paid_min_score: 358 },
  { specialty_id: 'bsu-s2', year: 2025, min_score: 391, paid_min_score: 359 },
  { specialty_id: 'bsu-s3', year: 2025, min_score: 387, paid_min_score: 358 },
  { specialty_id: 'bsu-s4', year: 2025, min_score: 378, paid_min_score: 341 },
  { specialty_id: 'bsu-s5', year: 2025, min_score: 346, paid_min_score: 308 },
  { specialty_id: 'bsu-s6', year: 2025, min_score: 351, paid_min_score: 313 },
  { specialty_id: 'bsu-s7', year: 2025, min_score: 360, paid_min_score: 309 },
  { specialty_id: 'bsu-s79', year: 2025, min_score: 262, paid_min_score: null },
  { specialty_id: 'bsu-s80', year: 2025, min_score: 354, paid_min_score: null },
  { specialty_id: 'bsu-s81', year: 2025, min_score: 360, paid_min_score: 319 },
  { specialty_id: 'bsu-s82', year: 2025, min_score: 364, paid_min_score: 333 },
  { specialty_id: 'bsu-s34', year: 2025, min_score: 341, paid_min_score: null },
  { specialty_id: 'bsu-s35', year: 2025, min_score: 351, paid_min_score: 322 },
  { specialty_id: 'bsu-s36', year: 2025, min_score: 329, paid_min_score: null },
  { specialty_id: 'bsu-s37', year: 2025, min_score: 337, paid_min_score: null },
  { specialty_id: 'bsu-s38', year: 2025, min_score: 193, paid_min_score: null },
  { specialty_id: 'bsu-s29', year: 2025, min_score: 355, paid_min_score: 330 },
  { specialty_id: 'bsu-s30', year: 2025, min_score: 358, paid_min_score: 324 },
  { specialty_id: 'bsu-s31', year: 2025, min_score: 351, paid_min_score: null },
  { specialty_id: 'bsu-s32', year: 2025, min_score: 357, paid_min_score: null },
  { specialty_id: 'bsu-s33', year: 2025, min_score: 329, paid_min_score: null },
  { specialty_id: 'bsu-s39', year: 2025, min_score: 326, paid_min_score: 290 },
  { specialty_id: 'bsu-s40', year: 2025, min_score: 355, paid_min_score: 313 },
  { specialty_id: 'bsu-s41', year: 2025, min_score: 335, paid_min_score: 304 },
  { specialty_id: 'bsu-s42', year: 2025, min_score: 352, paid_min_score: 325 },
  { specialty_id: 'bsu-s43', year: 2025, min_score: 321, paid_min_score: 290 },
  { specialty_id: 'bsu-s44', year: 2025, min_score: 332, paid_min_score: 314 },
  { specialty_id: 'bsu-s45', year: 2025, min_score: 354, paid_min_score: 320 },
  { specialty_id: 'bsu-s62', year: 2025, min_score: 302, paid_min_score: 291 },
  { specialty_id: 'bsu-s63', year: 2025, min_score: 309, paid_min_score: 292 },
  { specialty_id: 'bsu-s64', year: 2025, min_score: 316, paid_min_score: null },
  { specialty_id: 'bsu-s65', year: 2025, min_score: 347, paid_min_score: 295 },
  { specialty_id: 'bsu-s66', year: 2025, min_score: 327, paid_min_score: 291 },
  { specialty_id: 'bsu-s67', year: 2025, min_score: 331, paid_min_score: 296 },
  { specialty_id: 'bsu-s68', year: 2025, min_score: 351, paid_min_score: 293 },
  { specialty_id: 'bsu-s69', year: 2025, min_score: 313, paid_min_score: 293 },
  { specialty_id: 'bsu-s24', year: 2025, min_score: 347, paid_min_score: 296 },
  { specialty_id: 'bsu-s25', year: 2025, min_score: 324, paid_min_score: null },
  { specialty_id: 'bsu-s26', year: 2025, min_score: 374, paid_min_score: 301 },
  { specialty_id: 'bsu-s27', year: 2025, min_score: 322, paid_min_score: null },
  { specialty_id: 'bsu-s28', year: 2025, min_score: 315, paid_min_score: null },
  { specialty_id: 'bsu-s58', year: 2025, min_score: 341, paid_min_score: null },
  { specialty_id: 'bsu-s59', year: 2025, min_score: 362, paid_min_score: null },
  { specialty_id: 'bsu-s46', year: 2025, min_score: 395, paid_min_score: 358 },
  { specialty_id: 'bsu-s47', year: 2025, min_score: 398, paid_min_score: 353 },
  { specialty_id: 'bsu-s48', year: 2025, min_score: 377, paid_min_score: null },
  { specialty_id: 'bsu-s49', year: 2025, min_score: 377, paid_min_score: null },
  { specialty_id: 'bsu-s8', year: 2025, min_score: 397, paid_min_score: 371 },
  { specialty_id: 'bsu-s9', year: 2025, min_score: 382, paid_min_score: null },
  { specialty_id: 'bsu-s10', year: 2025, min_score: 391, paid_min_score: 325 },
  { specialty_id: 'bsu-s11', year: 2025, min_score: 382, paid_min_score: 314 },
  { specialty_id: 'bsu-s12', year: 2025, min_score: 387, paid_min_score: 314 },
  { specialty_id: 'bsu-s13', year: 2025, min_score: 388, paid_min_score: 334 },
  { specialty_id: 'bsu-s14', year: 2025, min_score: 393, paid_min_score: 354 },
  { specialty_id: 'bsu-s15', year: 2025, min_score: 362, paid_min_score: 329 },
  { specialty_id: 'bsu-s16', year: 2025, min_score: 362, paid_min_score: 334 },
  { specialty_id: 'bsu-s17', year: 2025, min_score: 366, paid_min_score: 339 },
  { specialty_id: 'bsu-s18', year: 2025, min_score: 366, paid_min_score: 325 },
  { specialty_id: 'bsu-s19', year: 2025, min_score: 363, paid_min_score: 320 },
  { specialty_id: 'bsu-s20', year: 2025, min_score: 337, paid_min_score: null },
  { specialty_id: 'bsu-s21', year: 2025, min_score: 338, paid_min_score: null },
  { specialty_id: 'bsu-s22', year: 2025, min_score: 322, paid_min_score: null },
  { specialty_id: 'bsu-s23', year: 2025, min_score: 344, paid_min_score: 295 },
  { specialty_id: 'bsu-s70', year: 2025, min_score: 368, paid_min_score: 332 },
  { specialty_id: 'bsu-s71', year: 2025, min_score: 368, paid_min_score: 347 },
  { specialty_id: 'bsu-s72', year: 2025, min_score: 373, paid_min_score: 344 },
  { specialty_id: 'bsu-s73', year: 2025, min_score: 382, paid_min_score: 357 },
  { specialty_id: 'bsu-s50', year: 2025, min_score: 350, paid_min_score: 293 },
  { specialty_id: 'bsu-s51', year: 2025, min_score: 377, paid_min_score: 297 },
  { specialty_id: 'bsu-s52', year: 2025, min_score: 342, paid_min_score: 301 },
  { specialty_id: 'bsu-s53', year: 2025, min_score: 229, paid_min_score: 209 },
  { specialty_id: 'bsu-s54', year: 2025, min_score: 366, paid_min_score: 342 },
  { specialty_id: 'bsu-s55', year: 2025, min_score: 234, paid_min_score: 215 },
  { specialty_id: 'bsu-s56', year: 2025, min_score: 254, paid_min_score: 220 },
  { specialty_id: 'bsu-s57', year: 2025, min_score: 251, paid_min_score: null },
  { specialty_id: 'bsu-s83', year: 2025, min_score: null, paid_min_score: 346 },
  { specialty_id: 'bsu-s84', year: 2025, min_score: null, paid_min_score: 312 },
  { specialty_id: 'bsu-s85', year: 2025, min_score: null, paid_min_score: 318 },
  { specialty_id: 'bsu-s86', year: 2025, min_score: null, paid_min_score: 320 },
  { specialty_id: 'bsu-s87', year: 2025, min_score: 288, paid_min_score: 313 },
  { specialty_id: 'bsu-s88', year: 2025, min_score: 294, paid_min_score: 282 },
  { specialty_id: 'bsu-s89', year: 2025, min_score: 288, paid_min_score: null },
  { specialty_id: 'bsu-s90', year: 2025, min_score: 271, paid_min_score: null },
  { specialty_id: 'bsu-s91', year: 2025, min_score: 311, paid_min_score: 271 },
  { specialty_id: 'bsu-s93', year: 2025, min_score: 272, paid_min_score: null },
  { specialty_id: 'bsu-s95', year: 2025, min_score: 371, paid_min_score: 302 },
  { specialty_id: 'bsu-s96', year: 2025, min_score: 353, paid_min_score: null },
  { specialty_id: 'bsu-s97', year: 2025, min_score: 367, paid_min_score: 317 },
  { specialty_id: 'bsu-s74', year: 2025, min_score: 335, paid_min_score: null },
  { specialty_id: 'bsu-s75', year: 2025, min_score: 338, paid_min_score: null },
  { specialty_id: 'bsu-s76', year: 2025, min_score: 231, paid_min_score: null },
  { specialty_id: 'bsu-s77', year: 2025, min_score: 323, paid_min_score: null },
];

async function insertData() {
  console.log('Starting data insertion...');
  
  // Insert BSU 2022
  console.log('Inserting BSU 2022 data...');
  const { error: error2022 } = await supabase.from('admission_stats').upsert(bsu2022Data, { onConflict: 'specialty_id,year' });
  if (error2022) console.error('BSU 2022 error:', error2022);
  else console.log('BSU 2022 inserted:', bsu2022Data.length);
  
  // Insert BSU 2023
  console.log('Inserting BSU 2023 data...');
  const { error: error2023 } = await supabase.from('admission_stats').upsert(bsu2023Data, { onConflict: 'specialty_id,year' });
  if (error2023) console.error('BSU 2023 error:', error2023);
  else console.log('BSU 2023 inserted:', bsu2023Data.length);
  
  // Insert BSU 2024
  console.log('Inserting BSU 2024 data...');
  const { error: error2024 } = await supabase.from('admission_stats').upsert(bsu2024Data, { onConflict: 'specialty_id,year' });
  if (error2024) console.error('BSU 2024 error:', error2024);
  else console.log('BSU 2024 inserted:', bsu2024Data.length);
  
  // Insert BSU 2025
  console.log('Inserting BSU 2025 data...');
  const { error: error2025 } = await supabase.from('admission_stats').upsert(bsu2025Data, { onConflict: 'specialty_id,year' });
  if (error2025) console.error('BSU 2025 error:', error2025);
  else console.log('BSU 2025 inserted:', bsu2025Data.length);
  
  // Verify counts
  const { data } = await supabase.from('admission_stats').select('year').then(({ data }) => {
    const counts = {};
    data.forEach(row => {
      counts[row.year] = (counts[row.year] || 0) + 1;
    });
    return { data: counts };
  });
  
  console.log('Total records by year:', data);
  console.log('Done!');
}

insertData().catch(console.error);
