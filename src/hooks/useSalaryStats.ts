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
         // Filter outliers using IQR method
         const filterOutliers = (arr: number[]): number[] => {
           if (arr.length < 5) return arr;
           const sorted = [...arr].sort((a, b) => a - b);
           const q1 = sorted[Math.floor(sorted.length * 0.25)];
           const q3 = sorted[Math.floor(sorted.length * 0.75)];
           const iqr = q3 - q1;
           const lowerBound = q1 - 1.5 * iqr;
           const upperBound = q3 + 1.5 * iqr;
           return sorted.filter(v => v >= lowerBound && v <= upperBound);
         };

         let filteredMins = filterOutliers(data.salaryMins);
         let filteredMaxs = filterOutliers(data.salaryMaxs);

         // Apply sanity caps - realistic salary ranges for Belarus (BYN)
         const applyCap = (arr: number[], maxCap: number): number[] => {
           return arr.filter(v => v <= maxCap && v >= 500); // min 500 BYN
         };

         // Category-specific max salary caps (realistic upper bounds)
         const maxCaps: Record<string, number> = {
           'ИТ': 8000,
           'Информационные технологии': 8000,
           'Финансы': 7000,
           'Экономика': 6000,
           'Медицина': 6000,
           'Юриспруденция': 6000,
           'Педагогика': 4000,
           'Инженерия': 5500,
           'Строительство': 5500,
           'Промышленность': 5000,
           'Торговля': 4500,
           'Образование': 3500,
           'Здравоохранение': 5500,
           'Логистика': 4500,
         };

         const cap = maxCaps[category] || 5000; // default cap
         filteredMins = applyCap(filteredMins, cap);
         filteredMaxs = applyCap(filteredMaxs, cap);

         // Use median instead of mean for robustness
         const median = (arr: number[]): number => {
           if (arr.length === 0) return 0;
           const sorted = [...arr].sort((a, b) => a - b);
           const mid = Math.floor(sorted.length / 2);
           return sorted.length % 2 === 0 
             ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
             : sorted[mid];
         };

         const avgMin = median(filteredMins);
         const avgMax = median(filteredMaxs);
         // Fallback to mean if median is 0 (too few samples)
         const finalAvgMin = avgMin > 0 ? avgMin : Math.round(filteredMins.reduce((a, b) => a + b, 0) / filteredMins.length) || 0;
         const finalAvgMax = avgMax > 0 ? avgMax : Math.round(filteredMaxs.reduce((a, b) => a + b, 0) / filteredMaxs.length) || 0;
         const avgSalary = Math.round((finalAvgMin + finalAvgMax) / 2);

        categories.push({
          category,
          avgSalaryMin: avgMin,
          avgSalaryMax: avgMax,
          avgSalary,
          vacancyCount: data.count,
        });

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
