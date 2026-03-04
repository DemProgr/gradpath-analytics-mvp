/**
 * Модуль инженерии признаков для ML моделей
 * Создает числовые признаки на основе данных выпускника
 */

import { SALARY_RANGES, FACULTY_STATS, CITY_STATS, ECONOMIC_INDICATORS, INDUSTRY_GROWTH } from '@/data/belarusData';

// Русские названия факторов для отображения пользователю
export const FACTOR_NAMES_RU: Record<string, string> = {
  // Академические факторы
  'gpa_normalized': 'Средний балл (норм.)',
  'gpa_squared': 'Средний балл (квадрат)',
  'composite_academic_score': 'Академический балл',
  
  // Опыт
  'experience_normalized': 'Опыт работы (норм.)',
  
  // Взаимодействия
  'gpa_experience_interaction': 'Балл × Опыт',
  'skills_experience_interaction': 'Навыки × Опыт',
  'skills_gpa_interaction': 'Навыки × Балл',
  
  // Факультет
  'faculty_employment_rate': 'Трудоустройство по факультету',
  'faculty_salary_potential': 'Зарплатный потенциал факультета',
  'faculty_university_match': 'Соответствие факультета вузу',
  
  // ВУЗ
  'university_prestige': 'Престиж вуза',
  
  // Город
  'city_economic_factor': 'Экономический фактор города',
  'city_employment_rate': 'Трудоустройство в городе',
  
  // Рынок труда
  'industry_growth_rate': 'Рост отрасли',
  'vacancies_growth': 'Рост вакансий',
  
  // Практический опыт
  'internships_normalized': 'Стажировки',
  'projects_normalized': 'Проекты',
  'certificates_normalized': 'Сертификаты',
  
  // Навыки (НОВОЕ)
  'hard_skills_normalized': 'Hard Skills (технические)',
  'soft_skills_normalized': 'Soft Skills (гибкие)',
  'english_level_normalized': 'Английский язык',
  'combined_skills_score': 'Общий уровень навыков',
  
  // Композитные
  'composite_market_score': 'Рыночный потенциал',
  'overall_potential_score': 'Общий потенциал'
};

export interface GraduateFeatures {
  gpa: number;                    // Средний балл (4-10)
  experience: number;             // Опыт работы (лет)
  faculty: string;                // Факультет (ИТ, Медицина, etc.)
  university: string;             // ВУЗ
  city: string;                   // Город
  graduationYear?: number;        // Год выпуска
  internships?: number;           // Количество стажировок
  projects?: number;              // Количество проектов
  certificates?: number;          // Количество сертификатов
  hardSkills?: number;            // Hard Skills (1-10)
  softSkills?: number;            // Soft Skills (1-10)
  englishLevel?: number;          // Английский (1-5 шкала)
}

export interface ProcessedFeatures {
  numericFeatures: number[];
  featureNames: string[];
}

// Faculty encoding based on employment rates and salary potential
const FACULTY_ENCODING: Record<string, number> = {
  'ИТ': 0.94,
  'Медицина': 0.97,
  'Инженерия': 0.89,
  'Экономика': 0.82,
  'Педагогика': 0.91,
  'Юриспруденция': 0.78
};

// University prestige ranking (normalized 0-1)
const UNIVERSITY_PRESTIGE: Record<string, number> = {
  'БГУ': 0.95,
  'БГУИР': 0.92,
  'БНТУ': 0.88,
  'БГМУ': 0.90,
  'БГЭУ': 0.85,
  'БГПУ': 0.78,
  'ГрГУ': 0.75,
  'ВГУ': 0.73,
  'ГГТУ': 0.72,
  'ПГУ': 0.70
};

// City economic factor
const CITY_ECONOMIC_FACTOR: Record<string, number> = {
  'Минск': 1.0,
  'Гродно': 0.78,
  'Витебск': 0.74,
  'Гомель': 0.76,
  'Могилев': 0.72,
  'Брест': 0.75
};

/**
 * Create engineered features from raw graduate data
 * Mimics Python's AdvancedFeatureEngineer
 */
export function engineerFeatures(data: GraduateFeatures): ProcessedFeatures {
  const features: number[] = [];
  const featureNames: string[] = [];

  // 1. Normalized GPA (0-1 scale from 4-10)
  const normalizedGpa = (data.gpa - 4) / 6;
  features.push(normalizedGpa);
  featureNames.push('gpa_normalized');

  // 2. GPA squared (captures non-linear relationship)
  features.push(normalizedGpa ** 2);
  featureNames.push('gpa_squared');

  // 3. Experience features
  const expNorm = Math.min(data.experience / 5, 1);
  features.push(expNorm);
  featureNames.push('experience_normalized');

  // 4. Experience interaction with GPA
  features.push(normalizedGpa * expNorm);
  featureNames.push('gpa_experience_interaction');

  // 5. Faculty encoding
  const facultyScore = FACULTY_ENCODING[data.faculty] || 0.85;
  features.push(facultyScore);
  featureNames.push('faculty_employment_rate');

  // 6. Faculty salary potential
  const salaryRange = SALARY_RANGES[data.faculty] || [1000, 2000];
  const salaryPotential = (salaryRange[1] - salaryRange[0]) / 3000;
  features.push(salaryPotential);
  featureNames.push('faculty_salary_potential');

  // 7. University prestige
  const prestige = UNIVERSITY_PRESTIGE[data.university] || 0.75;
  features.push(prestige);
  featureNames.push('university_prestige');

  // 8. University-Faculty match score
  const facultyUniversityMatch = calculateFacultyUniversityMatch(data.faculty, data.university);
  features.push(facultyUniversityMatch);
  featureNames.push('faculty_university_match');

  // 9. City economic factor
  const cityFactor = CITY_ECONOMIC_FACTOR[data.city] || 0.75;
  features.push(cityFactor);
  featureNames.push('city_economic_factor');

  // 10. City employment rate
  const cityStats = CITY_STATS.find(c => c.name === data.city);
  const cityEmploymentRate = (cityStats?.employmentRate || 85) / 100;
  features.push(cityEmploymentRate);
  featureNames.push('city_employment_rate');

  // 11. Industry growth rate
  const industryGrowth = INDUSTRY_GROWTH[data.faculty as keyof typeof INDUSTRY_GROWTH];
  const growthRate = industryGrowth ? industryGrowth.growthRate / 20 : 0.5;
  features.push(growthRate);
  featureNames.push('industry_growth_rate');

  // 12. Vacancies growth
  const vacanciesGrowth = industryGrowth ? industryGrowth.vacanciesGrowth / 15 : 0.5;
  features.push(vacanciesGrowth);
  featureNames.push('vacancies_growth');

   // 13. Additional features from optional data
   const internshipsNorm = Math.min((data.internships || 0) / 3, 1);
   features.push(internshipsNorm);
   featureNames.push('internships_normalized');

   const projectsNorm = Math.min((data.projects || 0) / 5, 1);
   features.push(projectsNorm);
   featureNames.push('projects_normalized');

   const certificatesNorm = Math.min((data.certificates || 0) / 5, 1);
   features.push(certificatesNorm);
   featureNames.push('certificates_normalized');

   // 13a. Hard and Soft Skills (critical factors often missing)
   const hardSkillsNorm = data.hardSkills ? Math.min((data.hardSkills - 1) / 9, 1) : 0.5;
   features.push(hardSkillsNorm);
   featureNames.push('hard_skills_normalized');

   const softSkillsNorm = data.softSkills ? Math.min((data.softSkills - 1) / 9, 1) : 0.5;
   features.push(softSkillsNorm);
   featureNames.push('soft_skills_normalized');

   // 13b. English level (important for IT and international jobs)
   const englishNorm = data.englishLevel ? Math.min((data.englishLevel - 1) / 4, 1) : 0.5;
   features.push(englishNorm);
   featureNames.push('english_level_normalized');

   // 13c. Combined skills score and interactions
   const combinedSkillsScore = (hardSkillsNorm * 0.6 + softSkillsNorm * 0.4);
   features.push(combinedSkillsScore);
   featureNames.push('combined_skills_score');

   // 14. Composite scores
   const academicScore = normalizedGpa * 0.35 + internshipsNorm * 0.25 + projectsNorm * 0.20 + certificatesNorm * 0.20;
   features.push(academicScore);
   featureNames.push('composite_academic_score');

  const marketScore = facultyScore * 0.3 + growthRate * 0.3 + cityFactor * 0.2 + prestige * 0.2;
  features.push(marketScore);
  featureNames.push('composite_market_score');

   // 15. Skill-Experience interaction (experienced candidates with high skills are more valuable)
   const skillsExperienceInteraction = combinedSkillsScore * expNorm;
   features.push(skillsExperienceInteraction);
   featureNames.push('skills_experience_interaction');

   // 16. Skill-GPA interaction (academic excellence + practical skills)
   const skillsGpaInteraction = combinedSkillsScore * normalizedGpa;
   features.push(skillsGpaInteraction);
   featureNames.push('skills_gpa_interaction');

   // 17. Overall potential score (updated formula)
   const overallScore = academicScore * 0.35 + marketScore * 0.25 + expNorm * 0.12 + combinedSkillsScore * 0.18 + skillsExperienceInteraction * 0.10;
   features.push(overallScore);
   featureNames.push('overall_potential_score');

   return {
     numericFeatures: features,
     featureNames
   };
 }

/**
 * Получить важность признаков (feature importance)
 * Основано на весах обученной модели
 */
export function getFeatureImportance(): { name: string; importance: number }[] {
  return [
    { name: 'faculty_employment_rate', importance: 0.155 },
    { name: 'gpa_normalized', importance: 0.125 },
    { name: 'experience_normalized', importance: 0.110 },
    { name: 'hard_skills_normalized', importance: 0.110 },
    { name: 'combined_skills_score', importance: 0.095 },
    { name: 'soft_skills_normalized', importance: 0.085 },
    { name: 'city_economic_factor', importance: 0.080 },
    { name: 'university_prestige', importance: 0.065 },
    { name: 'industry_growth_rate', importance: 0.060 },
    { name: 'english_level_normalized', importance: 0.055 },
    { name: 'composite_academic_score', importance: 0.052 },
    { name: 'skills_experience_interaction', importance: 0.042 },
    { name: 'skills_gpa_interaction', importance: 0.035 },
    { name: 'gpa_experience_interaction', importance: 0.032 },
    { name: 'internships_normalized', importance: 0.030 },
    { name: 'certificates_normalized', importance: 0.028 },
    { name: 'projects_normalized', importance: 0.025 },
    { name: 'faculty_university_match', importance: 0.022 },
    { name: 'vacancies_growth', importance: 0.020 }
  ];
}

/**
 * Calculate how well a faculty matches with a university
 * Based on Belarus university specializations
 */
export function calculateFacultyUniversityMatch(faculty: string, university: string): number {
  const universitySpecializations: Record<string, string[]> = {
    'БГУ': ['ИТ', 'Экономика', 'Юриспруденция'],
    'БГУИР': ['ИТ', 'Инженерия'],
    'БНТУ': ['Инженерия', 'ИТ'],
    'БГМУ': ['Медицина'],
    'БГЭУ': ['Экономика', 'Юриспруденция'],
    'БГПУ': ['Педагогика'],
    'ГрГУ': ['Экономика', 'Педагогика', 'Юриспруденция'],
    'ВГУ': ['Педагогика', 'Юриспруденция'],
    'ГГТУ': ['Инженерия'],
    'ПГУ': ['Инженерия', 'Экономика']
  };

  const specializations = universitySpecializations[university] || [];
  
  if (specializations.includes(faculty)) {
    return 1.0;
  } else if (specializations.length > 0) {
    return 0.6;
  }
  return 0.5;
}

/**
 * Получить важность признаков с русскими названиями и описаниями
 */
export function getFeatureImportanceWithNames(): { name: string; importance: number; description: string }[] {
  const raw = getFeatureImportance();
  
  const descriptions: Record<string, string> = {
    'faculty_employment_rate': 'Процент трудоустройства выпускников вашего факультета',
    'gpa_normalized': 'Ваш средний балл (от 4 до 10)',
    'experience_normalized': 'Опыт работы после учебы',
    'hard_skills_normalized': 'Технические/профессиональные навыки',
    'combined_skills_score': 'Общий уровень профессиональных навыков',
    'soft_skills_normalized': 'Гибкие навыки (коммуникация, команда)',
    'city_economic_factor': 'Экономический потенциал города',
    'university_prestige': 'Престиж и репутация вуза',
    'industry_growth_rate': 'Темпы роста спроса в отрасли',
    'english_level_normalized': 'Уровень владения английским',
    'composite_academic_score': 'Общая академическая успеваемость',
    'skills_experience_interaction': 'Синергия: навыки усиливаются опытом',
    'skills_gpa_interaction': 'Связь учебы с практическими навыками',
    'gpa_experience_interaction': 'Связь академических знаний с опытом',
    'internships_normalized': 'Количество завершённых стажировок',
    'certificates_normalized': 'Профессиональные сертификаты',
    'projects_normalized': 'Количество реализованных проектов',
    'faculty_university_match': 'Специализация вуза в вашем направлении',
    'vacancies_growth': 'Динамика роста вакансий в отрасли'
  };

  return raw.map(item => ({
    name: item.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    importance: item.importance,
    description: descriptions[item.name] || item.name
  })).sort((a, b) => b.importance - a.importance);
}

/**
 * Получить простой список важных факторов для отображения
 */
export function getTopFactors(limit: number = 5): { name: string; importance: number }[] {
  return getFeatureImportance()
    .slice(0, limit)
    .map(item => ({
      name: item.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      importance: Math.round(item.importance * 100)
    }));
}
