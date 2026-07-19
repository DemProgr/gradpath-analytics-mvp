/**
 * Data collection script for profession demand forecasts
 * Collects data from various Belarusian sources about in-demand professions
 */

import * as fs from 'fs';
import * as path from 'path';

interface ProfessionForecast {
  name: string;
  category: 'worker' | 'employee' | 'specialist';
  demand_level: 'high' | 'medium' | 'low';
  year: number;
  source: string;
  city: string;
  description?: string;
  related_specialties?: string[];
}

// Data from myfin.by (December 2025) - Мингорисполком forecast
const myfinData: ProfessionForecast[] = [
  // Workers - High demand
  { name: 'Водитель автомобиля', category: 'worker', demand_level: 'high', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Каменщик', category: 'worker', demand_level: 'high', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Маляр', category: 'worker', demand_level: 'high', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Штукатур', category: 'worker', demand_level: 'high', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Монтажник строительных конструкций', category: 'worker', demand_level: 'high', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Официант', category: 'worker', demand_level: 'high', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Повар', category: 'worker', demand_level: 'high', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Продавец', category: 'worker', demand_level: 'high', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Электромонтер', category: 'worker', demand_level: 'high', year: 2026, source: 'myfin.by', city: 'Минск' },
  
  // Employees - High demand
  { name: 'Бухгалтер', category: 'employee', demand_level: 'high', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Воспитатель', category: 'employee', demand_level: 'high', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Врач-специалист', category: 'employee', demand_level: 'high', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Государственный налоговый инспектор', category: 'employee', demand_level: 'high', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Менеджер по продажам', category: 'employee', demand_level: 'high', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Специалист по кадрам', category: 'employee', demand_level: 'high', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Специалист по оказанию банковских услуг', category: 'employee', demand_level: 'high', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Учитель', category: 'employee', demand_level: 'high', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Фельдшер', category: 'employee', demand_level: 'high', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Юрист', category: 'employee', demand_level: 'high', year: 2026, source: 'myfin.by', city: 'Минск' },
  
  // Workers - Low demand
  { name: 'Визажист', category: 'worker', demand_level: 'low', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Вязальщица', category: 'worker', demand_level: 'low', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Кузнец штамповки', category: 'worker', demand_level: 'low', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Настройщик инструментов', category: 'worker', demand_level: 'low', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Обойщик мебели', category: 'worker', demand_level: 'low', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Печатник', category: 'worker', demand_level: 'low', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Телеграфист', category: 'worker', demand_level: 'low', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Ткач', category: 'worker', demand_level: 'low', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Фотограф', category: 'worker', demand_level: 'low', year: 2026, source: 'myfin.by', city: 'Минск' },
  
  // Employees - Low demand
  { name: 'Дизайнер', category: 'employee', demand_level: 'low', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Зубной техник', category: 'employee', demand_level: 'low', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Тестировщик программного обеспечения', category: 'employee', demand_level: 'low', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Культорганизатор', category: 'employee', demand_level: 'low', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Художник', category: 'employee', demand_level: 'low', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Эколог', category: 'employee', demand_level: 'low', year: 2026, source: 'myfin.by', city: 'Минск' },
  { name: 'Экскурсовод', category: 'employee', demand_level: 'low', year: 2026, source: 'myfin.by', city: 'Минск' },
];

// Data from neg.by (January 2026) - Extended Мингорисполком forecast
const negByData: ProfessionForecast[] = [
  // Workers - High demand (extended list)
  { name: 'Бармен', category: 'worker', demand_level: 'high', year: 2026, source: 'neg.by', city: 'Минск' },
  { name: 'Бариста', category: 'worker', demand_level: 'high', year: 2026, source: 'neg.by', city: 'Минск' },
  { name: 'Монтажник сантехсистем и оборудования', category: 'worker', demand_level: 'high', year: 2026, source: 'neg.by', city: 'Минск' },
  { name: 'Наладчик станков с программным управлением', category: 'worker', demand_level: 'high', year: 2026, source: 'neg.by', city: 'Минск' },
  { name: 'Облицовщик-плиточник', category: 'worker', demand_level: 'high', year: 2026, source: 'neg.by', city: 'Минск' },
  { name: 'Контролер-кассир', category: 'worker', demand_level: 'high', year: 2026, source: 'neg.by', city: 'Минск' },
  { name: 'Кондитер', category: 'worker', demand_level: 'high', year: 2026, source: 'neg.by', city: 'Минск' },
  { name: 'Слесарь механосборочных работ', category: 'worker', demand_level: 'high', year: 2026, source: 'neg.by', city: 'Минск' },
  { name: 'Слесарь по ремонту автомобилей', category: 'worker', demand_level: 'high', year: 2026, source: 'neg.by', city: 'Минск' },
  { name: 'Слесарь-ремонтник', category: 'worker', demand_level: 'high', year: 2026, source: 'neg.by', city: 'Минск' },
  { name: 'Слесарь-сантехник', category: 'worker', demand_level: 'high', year: 2026, source: 'neg.by', city: 'Минск' },
  { name: 'Токарь', category: 'worker', demand_level: 'high', year: 2026, source: 'neg.by', city: 'Минск' },
  { name: 'Фрезеровщик', category: 'worker', demand_level: 'high', year: 2026, source: 'neg.by', city: 'Минск' },
  { name: 'Тракторист', category: 'worker', demand_level: 'high', year: 2026, source: 'neg.by', city: 'Минск' },
  { name: 'Электрогазосварщик', category: 'worker', demand_level: 'high', year: 2026, source: 'neg.by', city: 'Минск' },
  
  // Employees - High demand (extended list)
  { name: 'Инженер', category: 'employee', demand_level: 'high', year: 2026, source: 'neg.by', city: 'Минск' },
  { name: 'Маркетолог', category: 'employee', demand_level: 'high', year: 2026, source: 'neg.by', city: 'Минск' },
  { name: 'Медсестра', category: 'employee', demand_level: 'high', year: 2026, source: 'neg.by', city: 'Минск' },
  { name: 'Педагог дополнительного образования', category: 'employee', demand_level: 'high', year: 2026, source: 'neg.by', city: 'Минск' },
  { name: 'Педагог-психолог', category: 'employee', demand_level: 'high', year: 2026, source: 'neg.by', city: 'Минск' },
  { name: 'Экономист', category: 'employee', demand_level: 'high', year: 2026, source: 'neg.by', city: 'Минск' },
  
  // Workers - Low demand (extended list)
  { name: 'Косметик', category: 'worker', demand_level: 'low', year: 2026, source: 'neg.by', city: 'Минск' },
  { name: 'Закройщик', category: 'worker', demand_level: 'low', year: 2026, source: 'neg.by', city: 'Минск' },
  { name: 'Кузнец', category: 'worker', demand_level: 'low', year: 2026, source: 'neg.by', city: 'Минск' },
  { name: 'Радиомеханик', category: 'worker', demand_level: 'low', year: 2026, source: 'neg.by', city: 'Минск' },
  
  // Employees - Low demand (extended list)
  { name: 'Модельер-конструктор', category: 'employee', demand_level: 'low', year: 2026, source: 'neg.by', city: 'Минск' },
  { name: 'Корреспондент', category: 'employee', demand_level: 'low', year: 2026, source: 'neg.by', city: 'Минск' },
  { name: 'Риелтор', category: 'employee', demand_level: 'low', year: 2026, source: 'neg.by', city: 'Минск' },
  { name: 'Секретарь-референт', category: 'employee', demand_level: 'low', year: 2026, source: 'neg.by', city: 'Минск' },
  { name: 'Техник-программист', category: 'employee', demand_level: 'low', year: 2026, source: 'neg.by', city: 'Минск' },
];

// Data from kudapostupat.by (December 2025) - Минтруда forecast for 2026-2030
const kudapostupatData: ProfessionForecast[] = [
  // IT specialists - High demand
  { name: 'Программист', category: 'specialist', demand_level: 'high', year: 2026, source: 'kudapostupat.by', city: 'Беларусь', description: 'Нужны не только в IT-компаниях, но и в традиционных отраслях для повышения эффективности' },
  { name: 'Специалист по веб-порталам', category: 'specialist', demand_level: 'high', year: 2026, source: 'kudapostupat.by', city: 'Беларусь' },
  { name: 'Специалист технической поддержки', category: 'specialist', demand_level: 'high', year: 2026, source: 'kudapostupat.by', city: 'Беларусь' },
  
  // Processing industry - High demand
  { name: 'Станочник', category: 'worker', demand_level: 'high', year: 2026, source: 'kudapostupat.by', city: 'Беларусь', description: 'Квалифицированные рабочие для работы на сложном оборудовании' },
  { name: 'Наладчик', category: 'worker', demand_level: 'high', year: 2026, source: 'kudapostupat.by', city: 'Беларусь' },
  { name: 'Слесарь-сборщик', category: 'worker', demand_level: 'high', year: 2026, source: 'kudapostupat.by', city: 'Беларусь' },
  { name: 'Электромеханик', category: 'worker', demand_level: 'high', year: 2026, source: 'kudapostupat.by', city: 'Беларусь' },
  
  // Engineers - High demand
  { name: 'Инженер-технолог', category: 'specialist', demand_level: 'high', year: 2026, source: 'kudapostupat.by', city: 'Беларусь', description: 'Для обеспечения технологического прорыва' },
  { name: 'Инженер по контролю качества', category: 'specialist', demand_level: 'high', year: 2026, source: 'kudapostupat.by', city: 'Беларусь' },
  { name: 'Инженер-строитель', category: 'specialist', demand_level: 'high', year: 2026, source: 'kudapostupat.by', city: 'Беларусь' },
  { name: 'Инженер-механик', category: 'specialist', demand_level: 'high', year: 2026, source: 'kudapostupat.by', city: 'Беларусь' },
  
  // Construction - High demand
  { name: 'Бетонщик', category: 'worker', demand_level: 'high', year: 2026, source: 'kudapostupat.by', city: 'Беларусь' },
  { name: 'Сварщик', category: 'worker', demand_level: 'high', year: 2026, source: 'kudapostupat.by', city: 'Беларусь' },
  { name: 'Электромонтажник', category: 'worker', demand_level: 'high', year: 2026, source: 'kudapostupat.by', city: 'Беларусь' },
  
  // Healthcare - High demand
  { name: 'Специалист по уходу', category: 'specialist', demand_level: 'high', year: 2026, source: 'kudapostupat.by', city: 'Беларусь', description: 'Стабильный спрос из-за старения населения' },
  { name: 'Врач', category: 'specialist', demand_level: 'high', year: 2026, source: 'kudapostupat.by', city: 'Беларусь' },
  
  // Trade and catering - High demand
  { name: 'Кассир', category: 'worker', demand_level: 'medium', year: 2026, source: 'kudapostupat.by', city: 'Беларусь' },
  
  // Education - High demand
  { name: 'Педагог', category: 'specialist', demand_level: 'high', year: 2026, source: 'kudapostupat.by', city: 'Беларусь', description: 'Без качественного образования невозможно подготовить кадры' },
];

// Merge all data and remove duplicates
function mergeForecasts(): ProfessionForecast[] {
  const allData = [...myfinData, ...negByData, ...kudapostupatData];
  const uniqueMap = new Map<string, ProfessionForecast>();
  
  allData.forEach(forecast => {
    const key = `${forecast.name}-${forecast.year}`;
    const existing = uniqueMap.get(key);
    
    if (!existing) {
      uniqueMap.set(key, forecast);
    } else {
      // If duplicate exists, prefer the one with description or higher demand
      if (forecast.description && !existing.description) {
        uniqueMap.set(key, forecast);
      } else if (forecast.demand_level === 'high' && existing.demand_level !== 'high') {
        uniqueMap.set(key, forecast);
      }
    }
  });
  
  return Array.from(uniqueMap.values());
}

// Add related specialties mapping
function enrichWithSpecialties(forecasts: ProfessionForecast[]): ProfessionForecast[] {
  const specialtyMapping: Record<string, string[]> = {
    'Программист': ['Программное обеспечение информационных технологий', 'Информатика', 'Прикладная информатика'],
    'Инженер': ['Инженерные науки', 'Машиностроение', 'Электроника'],
    'Инженер-технолог': ['Технология машиностроения', 'Материаловедение'],
    'Инженер-строитель': ['Промышленное и гражданское строительство', 'Архитектура'],
    'Врач': ['Лечебное дело', 'Педиатрия', 'Стоматология'],
    'Врач-специалист': ['Лечебное дело', 'Педиатрия', 'Стоматология'],
    'Учитель': ['Педагогика', 'Начальное образование', 'Дошкольное образование'],
    'Педагог': ['Педагогика', 'Дошкольное образование', 'Начальное образование'],
    'Воспитатель': ['Дошкольное образование', 'Педагогика'],
    'Бухгалтер': ['Бухгалтерский учет, анализ и аудит', 'Финансы и кредит'],
    'Экономист': ['Экономика', 'Финансы и кредит', 'Мировая экономика'],
    'Юрист': ['Правоведение', 'Международное право'],
    'Маркетолог': ['Маркетинг', 'Менеджмент', 'Экономика'],
    'Менеджер по продажам': ['Менеджмент', 'Маркетинг', 'Коммерческая деятельность'],
    'Медсестра': ['Медицинское дело', 'Лечебное дело'],
    'Фельдшер': ['Медицинское дело', 'Лечебное дело'],
    'Специалист по кадрам': ['Управление персоналом', 'Менеджмент'],
    'Специалист по оказанию банковских услуг': ['Финансы и кредит', 'Банковское дело'],
    'Государственный налоговый инспектор': ['Государственное управление', 'Правоведение'],
    'Педагог-психолог': ['Психология', 'Педагогика'],
    'Педагог дополнительного образования': ['Педагогика', 'Дополнительное образование'],
    'Специалист по уходу': ['Медицинское дело', 'Социальная работа'],
    'Дизайнер': ['Дизайн', 'Архитектура'],
    'Тестировщик программного обеспечения': ['Программное обеспечение', 'Информатика'],
    'Техник-программист': ['Программное обеспечение', 'Информатика'],
    'Эколог': ['Экология', 'Природоохранная деятельность'],
  };
  
  return forecasts.map(f => ({
    ...f,
    related_specialties: specialtyMapping[f.name] || []
  }));
}

// Generate SQL for inserting data into database
function generateSQL(forecasts: ProfessionForecast[]): string {
  const values = forecasts.map((f, index) => {
    const relatedSpecs = f.related_specialties ? 
      `'${JSON.stringify(f.related_specialties).replace(/'/g, "''")}'` : 
      'NULL';
    
    return `(
      gen_random_uuid(),
      '${f.name.replace(/'/g, "''")}',
      '${f.category}',
      '${f.demand_level}',
      ${f.year},
      '${f.source.replace(/'/g, "''")}',
      '${f.city.replace(/'/g, "''")}',
      ${f.description ? `'${f.description.replace(/'/g, "''")}'` : 'NULL'},
      ${relatedSpecs},
      now(),
      now()
    )`;
  }).join(',\n');
  
  return `-- Insert profession forecasts data
INSERT INTO public.profession_forecasts (
  id, profession_name, category, demand_level, forecast_year, 
  source, city, description, related_specialties, created_at, updated_at
) VALUES ${values}
ON CONFLICT (profession_name, forecast_year) DO UPDATE SET
  category = EXCLUDED.category,
  demand_level = EXCLUDED.demand_level,
  source = EXCLUDED.source,
  city = EXCLUDED.city,
  description = EXCLUDED.description,
  related_specialties = EXCLUDED.related_specialties,
  updated_at = now();
`;
}

// Main execution
async function main() {
  console.log('Starting data collection...\n');
  
  // Merge all forecast data
  const mergedForecasts = mergeForecasts();
  console.log(`✓ Merged ${mergedForecasts.length} unique profession forecasts`);
  
  // Enrich with related specialties
  const enrichedForecasts = enrichWithSpecialties(mergedForecasts);
  console.log('✓ Enriched with related specialties');
  
  // Generate statistics
  const byDemand = {
    high: enrichedForecasts.filter(f => f.demand_level === 'high').length,
    medium: enrichedForecasts.filter(f => f.demand_level === 'medium').length,
    low: enrichedForecasts.filter(f => f.demand_level === 'low').length
  };
  
  const byCategory = {
    worker: enrichedForecasts.filter(f => f.category === 'worker').length,
    employee: enrichedForecasts.filter(f => f.category === 'employee').length,
    specialist: enrichedForecasts.filter(f => f.category === 'specialist').length
  };
  
  console.log('\n📊 Statistics:');
  console.log(`  By demand level:`);
  console.log(`    - High: ${byDemand.high}`);
  console.log(`    - Medium: ${byDemand.medium}`);
  console.log(`    - Low: ${byDemand.low}`);
  console.log(`\n  By category:`);
  console.log(`    - Workers: ${byCategory.worker}`);
  console.log(`    - Employees: ${byCategory.employee}`);
  console.log(`    - Specialists: ${byCategory.specialist}`);
  
  // Save as JSON
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const jsonPath = path.join(outputDir, 'profession-forecasts-2026.json');
  fs.writeFileSync(jsonPath, JSON.stringify(enrichedForecasts, null, 2));
  console.log(`\n✓ Saved JSON to: ${jsonPath}`);
  
  // Generate SQL
  const sql = generateSQL(enrichedForecasts);
  const sqlPath = path.join(outputDir, 'profession-forecasts-2026.sql');
  fs.writeFileSync(sqlPath, sql);
  console.log(`✓ Saved SQL to: ${sqlPath}`);
  
  // Generate summary report
  const report = {
    total_professions: enrichedForecasts.length,
    sources: ['myfin.by', 'neg.by', 'kudapostupat.by'],
    forecast_year: 2026,
    coverage: {
      by_demand: byDemand,
      by_category: byCategory,
      cities: ['Минск', 'Беларусь (общий)']
    },
    top_professions: enrichedForecasts
      .filter(f => f.demand_level === 'high')
      .map(f => f.name)
      .slice(0, 20)
  };
  
  const reportPath = path.join(outputDir, 'collection-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`✓ Saved report to: ${reportPath}`);
  
  console.log('\n✅ Data collection complete!');
  console.log('\nNext steps:');
  console.log('  1. Run the SQL in your Neon database');
  console.log('  2. Verify data was inserted correctly');
}

main().catch(console.error);
