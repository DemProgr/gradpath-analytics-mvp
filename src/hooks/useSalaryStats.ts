import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CategorySalaryStats {
  category: string;
  avgSalaryMin: number;
  avgSalaryMax: number;
  avgSalary: number;
  vacancyCount: number;
}

export interface SalaryStats {
  categories: CategorySalaryStats[];
  totalVacancies: number;
  overallAvgSalary: number;
  lastUpdated: string | null;
}

export function useSalaryStats() {
  return useQuery({
    queryKey: ['salary-stats'],
    queryFn: async (): Promise<SalaryStats> => {
      // Получаем агрегированные данные из vacancies - ВСЕ вакансии (increased limit)
      const { data: vacancies, error } = await supabase
        .from('vacancies')
        .select('category, salary_min, salary_max, parsed_at')
        .limit(50000);

      if (error) throw error;

      // Группируем по категориям
      const categoryMap = new Map<string, { 
        salaryMins: number[]; 
        salaryMaxs: number[]; 
        count: number;
      }>();

      let lastParsed: string | null = null;

      vacancies?.forEach(v => {
        if (!categoryMap.has(v.category)) {
          categoryMap.set(v.category, { salaryMins: [], salaryMaxs: [], count: 0 });
        }
        const cat = categoryMap.get(v.category)!;
        if (v.salary_min) cat.salaryMins.push(v.salary_min);
        if (v.salary_max) cat.salaryMaxs.push(v.salary_max);
        cat.count++;
        
        if (!lastParsed || v.parsed_at > lastParsed) {
          lastParsed = v.parsed_at;
        }
      });

       const categories: CategorySalaryStats[] = [];
       let totalSalary = 0;
       let totalCount = 0;

       categoryMap.forEach((data, category) => {
         // Simple approach: filter obvious outliers (below 500 or above reasonable caps)
         // Then use median for robustness
         
         // Normalize category name for lookup
         const normalizedCategory = category.trim();
         
         const maxCaps: Record<string, number> = {
           'ИТ': 8000,
           'Информационные технологии': 8000,
           'Финансы': 7000,
           'Экономика': 6000,
           'Медицина': 6000,
           'Право': 6000,
           'Педагогика': 4000,
           'Инженерия': 5500,
           'Инженерные специальности': 5500,
           'Строительство': 5500,
           'Промышленность': 5000,
           'Торговля': 4500,
           'Образование': 3500,
           'Здравоохранение': 5500,
           'Логистика': 4500,
           'Engineering': 5500,
           'Engineer': 5500,
         };
         
         // Try exact match first, then partial match
         let cap = maxCaps[normalizedCategory] || 5000;
         
         // If not found, try to match by keyword
         if (cap === 5000) {
           const lowerCat = normalizedCategory.toLowerCase();
           if (lowerCat.includes('инжен')) cap = 5500;
           else if (lowerCat.includes('строитель')) cap = 5500;
           else if (lowerCat.includes('it')) cap = 8000;
           else if (lowerCat.includes('программ')) cap = 8000;
         }
         
         if (category === 'Инженерия' || category.includes('Инжен') || category.includes('Engineer')) {
           console.log('[DEBUG] Category', category, 'has cap:', cap);
         }
         
         // Filter: remove values below 500 and above category cap
         const cleanMins = data.salaryMins.filter(v => v >= 500 && v <= cap);
         const cleanMaxs = data.salaryMaxs.filter(v => v >= 500 && v <= cap);
         
         if (category === 'Инженерия' || category.includes('Инжен') || category.includes('Engineer')) {
           console.log('[DEBUG]', category, '- rawMins count:', data.salaryMins.length, 'sample:', data.salaryMins.slice(0, 5));
           console.log('[DEBUG]', category, '- cleanMins count:', cleanMins.length, 'cap:', cap, 'sample:', cleanMins.slice(0, 5));
         }

         // Use median
         const median = (arr: number[]): number => {
           if (arr.length === 0) return 0;
           const sorted = [...arr].sort((a, b) => a - b);
           const mid = Math.floor(sorted.length / 2);
           return sorted.length % 2 === 0 
             ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
             : sorted[mid];
         };

         const avgMin = cleanMins.length > 0 ? median(cleanMins) : 0;
         const avgMax = cleanMaxs.length > 0 ? median(cleanMaxs) : 0;
         
         // Fallback to mean if median is 0
         const finalAvgMin = avgMin > 0 ? avgMin : (cleanMins.length > 0 ? Math.round(cleanMins.reduce((a, b) => a + b) / cleanMins.length) : 0);
         const finalAvgMax = avgMax > 0 ? avgMax : (cleanMaxs.length > 0 ? Math.round(cleanMaxs.reduce((a, b) => a + b) / cleanMaxs.length) : 0);
         
         let avgSalary = Math.round((finalAvgMin + finalAvgMax) / 2);
         
         // Final hard cap - never exceed realistic maximum even after calculation
         const finalCap = maxCaps[category] || 5000;
         if (avgSalary > finalCap) {
           if (category === 'Инженерия') {
             console.log('[DEBUG] Инженерия - applying final hard cap:', avgSalary, '->', finalCap);
           }
           avgSalary = finalCap;
         }
         
         if (category === 'Инженерия') {
           console.log('[DEBUG] Инженерия - final avgSalary:', avgSalary);
         }

         const finalCategory = category;
         categories.push({
           category: finalCategory,
           avgSalaryMin: avgMin,
           avgSalaryMax: avgMax,
           avgSalary,
           vacancyCount: data.count,
         });

         if (finalCategory === 'Инженерия') {
           console.log('[DEBUG] Инженерия final - avgMin:', avgMin, 'avgMax:', avgMax, 'avgSalary:', avgSalary);
         }

        totalSalary += avgSalary * data.count;
        totalCount += data.count;
      });

      // Сортируем по средней зарплате
      categories.sort((a, b) => b.avgSalary - a.avgSalary);

      return {
        categories,
        totalVacancies: vacancies?.length || 0,
        overallAvgSalary: totalCount > 0 ? Math.round(totalSalary / totalCount) : 0,
        lastUpdated: lastParsed,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 минут
  });
}
