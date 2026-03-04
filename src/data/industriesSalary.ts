export interface Industry {
  id: string;
  name: string;
  avgSalary: number;
  minSalary: number;
  maxSalary: number;
  growth: number;
  description: string;
}

export const INDUSTRIES: Industry[] = [
  { 
    id: 'it', 
    name: 'Информация и связь (IT)', 
    avgSalary: 7069, 
    minSalary: 3000, 
    maxSalary: 15000,
    growth: -3.1,
    description: 'Программисты, разработчики, IT-специалисты, телекоммуникации'
  },
  { 
    id: 'finance', 
    name: 'Финансовая и страховая деятельность', 
    avgSalary: 5665, 
    minSalary: 2500, 
    maxSalary: 12000,
    growth: 7.5,
    description: 'Банки, страхование, инвестиции, аналитика'
  },
  { 
    id: 'science', 
    name: 'Профессиональная, научная и техническая деятельность', 
    avgSalary: 4079, 
    minSalary: 2000, 
    maxSalary: 10000,
    growth: 7.7,
    description: 'Научные исследования, разработки, юридические услуги'
  },
  { 
    id: 'construction', 
    name: 'Строительство', 
    avgSalary: 3903, 
    minSalary: 2000, 
    maxSalary: 9000,
    growth: 17.9,
    description: 'Строительство зданий, дорог, архитектура'
  },
  { 
    id: 'industry', 
    name: 'Промышленность', 
    avgSalary: 3285, 
    minSalary: 1500, 
    maxSalary: 8000,
    growth: 7.0,
    description: 'Обрабатывающая промышленность, производство, машиностроение'
  },
  { 
    id: 'realestate', 
    name: 'Операции с недвижимым имуществом', 
    avgSalary: 2939, 
    minSalary: 1500, 
    maxSalary: 7000,
    growth: 11.9,
    description: 'Недвижимость, аренда, риелторские услуги'
  },
  { 
    id: 'trade', 
    name: 'Оптовая и розничная торговля', 
    avgSalary: 2930, 
    minSalary: 1200, 
    maxSalary: 8000,
    growth: 8.6,
    description: 'Магазины, торговые центры, оптовая торговля'
  },
  { 
    id: 'transport', 
    name: 'Транспортная деятельность', 
    avgSalary: 2888, 
    minSalary: 1500, 
    maxSalary: 7000,
    growth: 6.7,
    description: 'Грузоперевозки, логистика, такси, общественный транспорт'
  },
  { 
    id: 'health', 
    name: 'Здравоохранение и социальные услуги', 
    avgSalary: 2464, 
    minSalary: 1300, 
    maxSalary: 10000,
    growth: 9.9,
    description: 'Больницы, поликлиники, социальная помощь'
  },
  { 
    id: 'agriculture', 
    name: 'Сельское, лесное и рыбное хозяйство', 
    avgSalary: 2431, 
    minSalary: 1100, 
    maxSalary: 5000,
    growth: 13.7,
    description: 'Сельское хозяйство, растениеводство, животноводство'
  },
  { 
    id: 'culture', 
    name: 'Творчество, спорт, развлечения и отдых', 
    avgSalary: 2383, 
    minSalary: 1000, 
    maxSalary: 8000,
    growth: 13.8,
    description: 'Культура, искусство, спорт, развлечения'
  },
  { 
    id: 'education', 
    name: 'Образование', 
    avgSalary: 2040, 
    minSalary: 1100, 
    maxSalary: 6000,
    growth: 12.0,
    description: 'Школы, вузы, детские сады, дополнительное образование'
  },
  { 
    id: 'hospitality', 
    name: 'Услуги по временному проживанию и питанию', 
    avgSalary: 2273, 
    minSalary: 1000, 
    maxSalary: 5000,
    growth: 10.8,
    description: 'Гостиницы, рестораны, кафе, общепит'
  },
  { 
    id: 'other', 
    name: 'Предоставление прочих видов услуг', 
    avgSalary: 2317, 
    minSalary: 1100, 
    maxSalary: 6000,
    growth: 11.3,
    description: 'Другие виды услуг'
  },
  { 
    id: 'admin', 
    name: 'Административные и вспомогательные услуги', 
    avgSalary: 2274, 
    minSalary: 1200, 
    maxSalary: 5000,
    growth: 14.1,
    description: 'Аренда, уборка, охрана, консультации'
  },
];

export const AVG_SALARY_OVERALL = 3112;

export function getIndustryById(id: string) {
  return INDUSTRIES.find(i => i.id === id);
}

export function formatSalary(salary: number): string {
  return salary.toLocaleString() + ' BYN';
}
