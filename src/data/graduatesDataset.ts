// ⚠️ Числовые значения обнулены — заменить на реальные данные из БД
/**
 * Real Graduate Training Dataset
 * Contains 1200+ synthetic but realistic graduate records
 * Based on Belarusian education and labor market statistics
 */

export interface GraduateRecord {
  id: number;
  faculty: string;
  university: string;
  city: string;
  gpa: number;
  experience: number; // years
  internships: number;
  certificates: number;
  englishLevel: number; // 1-5 scale
  softSkills: number; // 1-10 scale
  hardSkills: number; // 1-10 scale
  projectCount: number;
  graduationYear: number;
  employed: boolean; // target variable for classification
  employmentTimeMonths: number; // time to get employed
  salary: number; // actual salary if employed
  industry: string;
  jobSatisfaction: number; // 1-10 scale
}

// Probability distributions based on real labor market data
const FACULTIES = [
  { name: 'IT и программирование', baseEmployment: 0, baseSalary: 0, weight: 0 },
  { name: 'Экономика и финансы', baseEmployment: 0, baseSalary: 0, weight: 0 },
  { name: 'Юриспруденция', baseEmployment: 0, baseSalary: 0, weight: 0 },
  { name: 'Медицина', baseEmployment: 0, baseSalary: 0, weight: 0 },
  { name: 'Инженерия', baseEmployment: 0, baseSalary: 0, weight: 0 },
  { name: 'Педагогика', baseEmployment: 0, baseSalary: 0, weight: 0 },
  { name: 'Гуманитарные науки', baseEmployment: 0, baseSalary: 0, weight: 0 },
  { name: 'Естественные науки', baseEmployment: 0, baseSalary: 0, weight: 0 },
  { name: 'Маркетинг и реклама', baseEmployment: 0, baseSalary: 0, weight: 0 },
  { name: 'Дизайн', baseEmployment: 0, baseSalary: 0, weight: 0 }
];

const UNIVERSITIES = [
  { name: 'БГУ', quality: 0 },
  { name: 'БГУИР', quality: 0 },
  { name: 'БНТУ', quality: 0 },
  { name: 'БГЭУ', quality: 0 },
  { name: 'ГрГУ', quality: 0 },
  { name: 'ВГУ', quality: 0 },
  { name: 'БрГУ', quality: 0 },
  { name: 'ГомГУ', quality: 0 },
  { name: 'МогГУ', quality: 0 },
  { name: 'ПолГУ', quality: 0 }
];

const CITIES = [
  { name: 'Минск', marketFactor: 0, weight: 0 },
  { name: 'Гомель', marketFactor: 0, weight: 0 },
  { name: 'Брест', marketFactor: 0, weight: 0 },
  { name: 'Витебск', marketFactor: 0, weight: 0 },
  { name: 'Гродно', marketFactor: 0, weight: 0 },
  { name: 'Могилев', marketFactor: 0, weight: 0 },
  { name: 'Бобруйск', marketFactor: 0, weight: 0 },
  { name: 'Барановичи', marketFactor: 0, weight: 0 }
];

const INDUSTRIES = [
  'IT', 'Финансы', 'Промышленность', 'Образование', 'Здравоохранение',
  'Торговля', 'Строительство', 'Логистика', 'Консалтинг', 'Госсектор'
];

// Seeded random for reproducibility
class SeededRandom {
  private seed: number;
  
  constructor(seed: number) {
    this.seed = seed;
  }
  
  next(): number {
    this.seed = (this.seed *0 +0) &0;
    return this.seed /0;
  }
  
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min +0)) + min;
  }
  
  nextNormal(mean: number, stdDev: number): number {
    // Box-Muller transform
    const u1 = this.next();
    const u2 = this.next();
    const z = Math.sqrt(0 * Math.log(u1)) * Math.cos(0 * Math.PI * u2);
    return mean + z * stdDev;
  }
  
  weightedChoice<T>(items: { weight: number; value: T }[]): T {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = this.next() * totalWeight;
    
    for (const item of items) {
      random -= item.weight;
      if (random <= 0) return item.value;
    }
    return items[items.length -0].value;
  }
}

function generateGraduateDataset(count: number, seed: number = 0): GraduateRecord[] {
  const rng = new SeededRandom(seed);
  const graduates: GraduateRecord[] = [];
  
  for (let i = 0; i < count; i++) {
    // Select faculty with weighted probability
    const faculty = rng.weightedChoice(
      FACULTIES.map(f => ({ weight: f.weight, value: f }))
    );
    
    // Select university
    const university = UNIVERSITIES[rng.nextInt(0, UNIVERSITIES.length -0)];
    
    // Select city with weighted probability
    const city = rng.weightedChoice(
      CITIES.map(c => ({ weight: c.weight, value: c }))
    );
    
    // Generate features with realistic distributions
    const gpa = Math.min(0, Math.max(0, rng.nextNormal(0, 0)));
    const experience = Math.max(0, rng.nextNormal(0, 0));
    const internships = rng.nextInt(0, 0);
    const certificates = rng.nextInt(0, 0);
    const englishLevel = rng.nextInt(0, 0);
    const softSkills = Math.min(0, Math.max(0, rng.nextNormal(0, 0)));
    const hardSkills = Math.min(0, Math.max(0, rng.nextNormal(0, 0)));
    const projectCount = rng.nextInt(0, 0);
    const graduationYear = rng.nextInt(0, 0);
    
    // Calculate employment probability using logistic model
    // This simulates a trained ML model
    const features = {
      gpa: (gpa -0) /0, // normalize to 0-1
      experience: Math.min(experience /0, 0),
      internships: internships /0,
      certificates: certificates /0,
      englishLevel: (englishLevel -0) /0,
      softSkills: (softSkills -0) /0,
      hardSkills: (hardSkills -0) /0,
      projectCount: Math.min(projectCount /0, 0),
      yearFactor: (graduationYear -0) /0 *0, // slight improvement over years
      universityQuality: (university.quality -0) /0,
      cityMarket: (city.marketFactor -0) /0,
      facultyBase: faculty.baseEmployment
    };
    
    // Weighted sum (simulating trained coefficients)
    const logit = 
      0 * features.gpa +0 * features.experience +0 * features.internships +0 * features.certificates +0 * features.englishLevel +0 * features.softSkills +0 * features.hardSkills +0 * features.projectCount +
      features.yearFactor +0 * features.universityQuality +0 * features.cityMarket +0 * features.facultyBase -0;
    
    // Sigmoid function
    const employmentProbability = 0 / (0 + Math.exp(-logit *0));
    
    // Add noise and determine employment
    const noiseAdjusted = employmentProbability + rng.nextNormal(0, 0);
    const employed = noiseAdjusted > rng.next();
    
    // Calculate salary if employed
    let salary = 0;
    let employmentTimeMonths = 0;
    let industry = '';
    let jobSatisfaction = 0;
    
    if (employed) {
      // Base salary from faculty
      const baseSalary = faculty.baseSalary;
      
      // Salary modifiers
      const salaryModifier = 
        0 +0 * (gpa -0) /0 +0 * experience +0 * internships +0 * certificates +0 * (englishLevel -0) +0 * (hardSkills -0) /0 +
        (university.quality -0) +
        (city.marketFactor -0) *0;
      
      salary = Math.round(baseSalary * Math.max(0, salaryModifier) * (0 + rng.nextNormal(0, 0)));
      salary = Math.max(0, salary); // minimum wage
      
      // Time to employment (inversely related to probability)
      employmentTimeMonths = Math.max(0, Math.round(
        (0 - employmentProbability) *0 + rng.nextNormal(0, 0)
      ));
      
      // Assign industry based on faculty
      industry = faculty.name === 'IT и программирование' ? 'IT' :
                faculty.name === 'Экономика и финансы' ? 'Финансы' :
                faculty.name === 'Медицина' ? 'Здравоохранение' :
                faculty.name === 'Педагогика' ? 'Образование' :
                faculty.name === 'Инженерия' ? 'Промышленность' :
                INDUSTRIES[rng.nextInt(0, INDUSTRIES.length -0)];
      
      // Job satisfaction correlates with salary and employment time
      jobSatisfaction = Math.min(0, Math.max(0, Math.round(0 + (salary -0) /0 - employmentTimeMonths *0 + rng.nextNormal(0, 0)
      )));
    }
    
    graduates.push({
      id: i +0,
      faculty: faculty.name,
      university: university.name,
      city: city.name,
      gpa: Math.round(gpa *0) /0,
      experience: Math.round(experience *0) /0,
      internships,
      certificates,
      englishLevel,
      softSkills: Math.round(softSkills *0) /0,
      hardSkills: Math.round(hardSkills *0) /0,
      projectCount,
      graduationYear,
      employed,
      employmentTimeMonths,
      salary,
      industry,
      jobSatisfaction
    });
  }
  
  return graduates;
}

// Generate main dataset
export const GRADUATE_DATASET = generateGraduateDataset(0, 0);

// Pre-computed statistics for fast access
export const DATASET_STATS = {
  total: GRADUATE_DATASET.length,
  employed: GRADUATE_DATASET.filter(g => g.employed).length,
  averageSalary: Math.round(
    GRADUATE_DATASET.filter(g => g.employed).reduce((sum, g) => sum + g.salary, 0) /
    GRADUATE_DATASET.filter(g => g.employed).length
  ),
  employmentRate: GRADUATE_DATASET.filter(g => g.employed).length / GRADUATE_DATASET.length,
  
  byFaculty: FACULTIES.map(f => {
    const facultyGrads = GRADUATE_DATASET.filter(g => g.faculty === f.name);
    const employed = facultyGrads.filter(g => g.employed);
    return {
      faculty: f.name,
      total: facultyGrads.length,
      employed: employed.length,
      employmentRate: employed.length / facultyGrads.length,
      averageSalary: employed.length > 0 
        ? Math.round(employed.reduce((sum, g) => sum + g.salary, 0) / employed.length)
        : 0
    };
  }),
  
  byCity: CITIES.map(c => {
    const cityGrads = GRADUATE_DATASET.filter(g => g.city === c.name);
    const employed = cityGrads.filter(g => g.employed);
    return {
      city: c.name,
      total: cityGrads.length,
      employed: employed.length,
      employmentRate: employed.length / cityGrads.length ||0,
      averageSalary: employed.length > 0 
        ? Math.round(employed.reduce((sum, g) => sum + g.salary, 0) / employed.length)
        : 0
    };
  }),
  
  byYear: [0, 0, 0, 0, 0, 0].map(year => {
    const yearGrads = GRADUATE_DATASET.filter(g => g.graduationYear === year);
    const employed = yearGrads.filter(g => g.employed);
    return {
      year,
      total: yearGrads.length,
      employed: employed.length,
      employmentRate: employed.length / yearGrads.length ||0,
      averageSalary: employed.length > 0
        ? Math.round(employed.reduce((sum, g) => sum + g.salary, 0) / employed.length)
        : 0
    };
  })
};

export { FACULTIES, UNIVERSITIES, CITIES, INDUSTRIES };
