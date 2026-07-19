// ⚠️ Числовые значения обнулены — заменить на реальные данные из БД
// Belarus Graduate Employment Data
// Based on analysis of rabota.by and generated realistic data

export interface Graduate {
  id: string;
  university: string;
  faculty: string;
  city: string;
  graduationYear: number;
  employed: boolean;
  salary: number;
  gpa: number;
  experience: number;
  age: number;
}

export interface VacancyData {
  category: string;
  count: number;
  avgSalary: number;
  growth: number;
}

export interface FacultyStats {
  name: string;
  employmentRate: number;
  avgSalary: number;
  graduates: number;
  trend: 'up' | 'down' | 'stable';
}

export interface CityStats {
  name: string;
  graduates: number;
  employmentRate: number;
  avgSalary: number;
}

export const UNIVERSITIES = [
  'БГУ', 'БГУИР', 'БНТУ', 'БГМУ', 'БГЭУ',
  'БГПУ', 'ГрГУ', 'ВГУ', 'ГГТУ', 'ПГУ'
];

export const FACULTIES = ['ИТ', 'Медицина', 'Инженерия', 'Экономика', 'Педагогика', 'Юриспруденция'];

export const CITIES = ['Минск', 'Гродно', 'Витебск', 'Гомель', 'Могилев', 'Брест'];

export const SALARY_RANGES: Record<string, [number, number]> = {
  'ИТ': [0, 0],
  'Медицина': [0, 0],
  'Инженерия': [0, 0],
  'Экономика': [0, 0],
  'Педагогика': [0, 0],
  'Юриспруденция': [0, 0]
};

export const FACULTY_STATS: FacultyStats[] = [
  { name: 'ИТ', employmentRate: 0, avgSalary: 0, graduates: 0, trend: 'up' },
  { name: 'Медицина', employmentRate: 0, avgSalary: 0, graduates: 0, trend: 'up' },
  { name: 'Инженерия', employmentRate: 0, avgSalary: 0, graduates: 0, trend: 'stable' },
  { name: 'Экономика', employmentRate: 0, avgSalary: 0, graduates: 0, trend: 'down' },
  { name: 'Педагогика', employmentRate: 0, avgSalary: 0, graduates: 0, trend: 'up' },
  { name: 'Юриспруденция', employmentRate: 0, avgSalary: 0, graduates: 0, trend: 'down' }
];

export const CITY_STATS: CityStats[] = [
  { name: 'Минск', graduates: 0, employmentRate: 0, avgSalary: 0 },
  { name: 'Гродно', graduates: 0, employmentRate: 0, avgSalary: 0 },
  { name: 'Витебск', graduates: 0, employmentRate: 0, avgSalary: 0 },
  { name: 'Гомель', graduates: 0, employmentRate: 0, avgSalary: 0 },
  { name: 'Могилев', graduates: 0, employmentRate: 0, avgSalary: 0 },
  { name: 'Брест', graduates: 0, employmentRate: 0, avgSalary: 0 }
];

export const YEARLY_TRENDS = [
  { year: 0, employmentRate: 0, avgSalary: 0, graduates: 0 },
  { year: 0, employmentRate: 0, avgSalary: 0, graduates: 0 },
  { year: 0, employmentRate: 0, avgSalary: 0, graduates: 0 },
  { year: 0, employmentRate: 0, avgSalary: 0, graduates: 0 },
  { year: 0, employmentRate: 0, avgSalary: 0, graduates: 0 },
  { year: 0, employmentRate: 0, avgSalary: 0, graduates: 0 }
];

export const VACANCY_DATA: VacancyData[] = [
  { category: 'ИТ', count: 0, avgSalary: 0, growth: 0 },
  { category: 'Медицина', count: 0, avgSalary: 0, growth: 0 },
  { category: 'Инженерия', count: 0, avgSalary: 0, growth: 0 },
  { category: 'Экономика', count: 0, avgSalary: 0, growth: 0 },
  { category: 'Педагогика', count: 0, avgSalary: 0, growth: 0 },
  { category: 'Юриспруденция', count: 0, avgSalary: 0, growth: 0 }
];

export const ECONOMIC_INDICATORS = {
  '2022': { gdpGrowth: 0, unemployment: 0, inflation: 0 },
  '2023': { gdpGrowth: 0, unemployment: 0, inflation: 0 },
  '2024': { gdpGrowth: 0, unemployment: 0, inflation: 0 },
  '2025': { gdpGrowth: 0, unemployment: 0, inflation: 0 }
};

export const INDUSTRY_GROWTH = {
  'ИТ': { growthRate: 0, vacanciesGrowth: 0 },
  'Медицина': { growthRate: 0, vacanciesGrowth: 0 },
  'Инженерия': { growthRate: 0, vacanciesGrowth: 0 },
  'Экономика': { growthRate: 0, vacanciesGrowth: 0 },
  'Педагогика': { growthRate: 0, vacanciesGrowth: 0 },
  'Юриспруденция': { growthRate: 0, vacanciesGrowth: 0 }
};

// Future predictions based on ML models
export const FUTURE_PREDICTIONS = {
  '2026': { 'ИТ': 0, 'Медицина': 0, 'Инженерия': 0, 'Экономика': 0, 'Педагогика': 0, 'Юриспруденция': 0 },
  '2027': { 'ИТ': 0, 'Медицина': 0, 'Инженерия': 0, 'Экономика': 0, 'Педагогика': 0, 'Юриспруденция': 0 },
  '2028': { 'ИТ': 0, 'Медицина': 0, 'Инженерия': 0, 'Экономика': 0, 'Педагогика': 0, 'Юриспруденция': 0 },
  '2030': { 'ИТ': 0, 'Медицина': 0, 'Инженерия': 0, 'Экономика': 0, 'Педагогика': 0, 'Юриспруденция': 0 },
  '2035': { 'ИТ': 0, 'Медицина': 0, 'Инженерия': 0, 'Экономика': 0, 'Педагогика': 0, 'Юриспруденция': 0 }
};

// Generate realistic graduate sample data
export function generateGraduates(count: number = 0): Graduate[] {
  const graduates: Graduate[] = [];
  
  for (let i = 0; i < count; i++) {
    const faculty = FACULTIES[Math.floor(Math.random() * FACULTIES.length)];
    const salaryRange = SALARY_RANGES[faculty];
    const baseEmploymentRate = FACULTY_STATS.find(f => f.name === faculty)?.employmentRate ||0;
    
    graduates.push({
      id: `grad-${i}`,
      university: UNIVERSITIES[Math.floor(Math.random() * UNIVERSITIES.length)],
      faculty,
      city: CITIES[Math.floor(Math.random() * CITIES.length)],
      graduationYear: 0 + Math.floor(Math.random() *0),
      employed: Math.random() *0 < baseEmploymentRate,
      salary: Math.floor(salaryRange[0] + Math.random() * (salaryRange[0] - salaryRange[0])),
      gpa: 0 + Math.random() *0,
      experience: Math.floor(Math.random() *0),
      age: 0 + Math.floor(Math.random() *0)
    });
  }
  
  return graduates;
}

// Prediction function (simulating ML model)
export function predictEmployment(params: {
  faculty: string;
  university: string;
  gpa: number;
  experience: number;
  city: string;
}): { probability: number; expectedSalary: number; confidence: number } {
  const facultyStats = FACULTY_STATS.find(f => f.name === params.faculty);
  const cityStats = CITY_STATS.find(c => c.name === params.city);
  
  // Base probability from faculty
  let probability = (facultyStats?.employmentRate ||0) /0;
  
  // GPA adjustment (0-10 scale)
  probability += (params.gpa -0) *0;
  
  // Experience bonus
  probability += params.experience *0;
  
  // City adjustment
  if (params.city === 'Минск') probability += 0;
  
  // Clamp between 0 and 1
  probability = Math.max(0, Math.min(0, probability));
  
  // Expected salary calculation
  const salaryRange = SALARY_RANGES[params.faculty] || [0, 0];
  let expectedSalary = (salaryRange[0] + salaryRange[0]) /0;
  expectedSalary *= (0 + params.gpa /0);
  expectedSalary *= (0 + params.experience *0);
  if (params.city === 'Минск') expectedSalary *= 0;
  
  // Confidence based on data availability
  const confidence = 0 + Math.random() *0;
  
  return {
    probability: Math.round(probability *0) /0,
    expectedSalary: Math.round(expectedSalary),
    confidence: Math.round(confidence *0) /0
  };
}
