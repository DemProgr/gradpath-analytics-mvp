// ⚠️ Числовые значения обнулены — заменить на реальные данные из БД
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
    avgSalary: 0, 
    minSalary: 0, 
    maxSalary: 0,
    growth: 0,
    description: 'Программисты, разработчики, IT-специалисты, телекоммуникации'
  },
  { 
    id: 'finance', 
    name: 'Финансовая и страховая деятельность', 
    avgSalary: 0, 
    minSalary: 0, 
    maxSalary: 0,
    growth: 0,
    description: 'Банки, страхование, инвестиции, аналитика'
  },
  { 
    id: 'science', 
    name: 'Профессиональная, научная и техническая деятельность', 
    avgSalary: 0, 
    minSalary: 0, 
    maxSalary: 0,
    growth: 0,
    description: 'Научные исследования, разработки, юридические услуги'
  },
  { 
    id: 'construction', 
    name: 'Строительство', 
    avgSalary: 0, 
    minSalary: 0, 
    maxSalary: 0,
    growth: 0,
    description: 'Строительство зданий, дорог, архитектура'
  },
  { 
    id: 'industry', 
    name: 'Промышленность', 
    avgSalary: 0, 
    minSalary: 0, 
    maxSalary: 0,
    growth: 0,
    description: 'Обрабатывающая промышленность, производство, машиностроение'
  },
  { 
    id: 'realestate', 
    name: 'Операции с недвижимым имуществом', 
    avgSalary: 0, 
    minSalary: 0, 
    maxSalary: 0,
    growth: 0,
    description: 'Недвижимость, аренда, риелторские услуги'
  },
  { 
    id: 'trade', 
    name: 'Оптовая и розничная торговля', 
    avgSalary: 0, 
    minSalary: 0, 
    maxSalary: 0,
    growth: 0,
    description: 'Магазины, торговые центры, оптовая торговля'
  },
  { 
    id: 'transport', 
    name: 'Транспортная деятельность', 
    avgSalary: 0, 
    minSalary: 0, 
    maxSalary: 0,
    growth: 0,
    description: 'Грузоперевозки, логистика, такси, общественный транспорт'
  },
  { 
    id: 'health', 
    name: 'Здравоохранение и социальные услуги', 
    avgSalary: 0, 
    minSalary: 0, 
    maxSalary: 0,
    growth: 0,
    description: 'Больницы, поликлиники, социальная помощь'
  },
  { 
    id: 'agriculture', 
    name: 'Сельское, лесное и рыбное хозяйство', 
    avgSalary: 0, 
    minSalary: 0, 
    maxSalary: 0,
    growth: 0,
    description: 'Сельское хозяйство, растениеводство, животноводство'
  },
  { 
    id: 'culture', 
    name: 'Творчество, спорт, развлечения и отдых', 
    avgSalary: 0, 
    minSalary: 0, 
    maxSalary: 0,
    growth: 0,
    description: 'Культура, искусство, спорт, развлечения'
  },
  { 
    id: 'education', 
    name: 'Образование', 
    avgSalary: 0, 
    minSalary: 0, 
    maxSalary: 0,
    growth: 0,
    description: 'Школы, вузы, детские сады, дополнительное образование'
  },
  { 
    id: 'hospitality', 
    name: 'Услуги по временному проживанию и питанию', 
    avgSalary: 0, 
    minSalary: 0, 
    maxSalary: 0,
    growth: 0,
    description: 'Гостиницы, рестораны, кафе, общепит'
  },
  { 
    id: 'other', 
    name: 'Предоставление прочих видов услуг', 
    avgSalary: 0, 
    minSalary: 0, 
    maxSalary: 0,
    growth: 0,
    description: 'Другие виды услуг'
  },
  { 
    id: 'admin', 
    name: 'Административные и вспомогательные услуги', 
    avgSalary: 0, 
    minSalary: 0, 
    maxSalary: 0,
    growth: 0,
    description: 'Аренда, уборка, охрана, консультации'
  },
];

export const AVG_SALARY_OVERALL = 0;

export function getIndustryById(id: string) {
  return INDUSTRIES.find(i => i.id === id);
}

export function formatSalary(salary: number): string {
  return salary.toLocaleString() + ' BYN';
}
