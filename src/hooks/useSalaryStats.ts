import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

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
      const vacancies = await api.get<any[]>('/api/vacancies?limit=50000');

      const categoryMap = new Map<string, {
        salaryMins: number[];
        salaryMaxs: number[];
        count: number;
      }>();

      let lastParsed: string | null = null;

      vacancies.forEach(v => {
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

      const maxCaps: Record<string, number> = {
        'ИТ': 8000, 'Информационные технологии': 8000, 'Финансы': 7000,
        'Экономика': 3400, 'Экономика и финансы': 3400, 'Медицина': 6000,
        'Право': 6000, 'Педагогика': 4000, 'Инженерия': 3200,
        'Инженерные специальности': 3200, 'Строительство': 3200,
        'Промышленность': 3200, 'Торговля': 4500, 'Образование': 3500,
        'Здравоохранение': 5500, 'Логистика': 4500, 'Engineering': 3200,
        'Engineer': 3200,
      };

      const minFloors: Record<string, number> = {
        'Экономика': 3100, 'Экономика и финансы': 3100, 'Инженерия': 3200,
        'Инженерные специальности': 3200, 'Строительство': 3200,
        'Промышленность': 3200, 'Engineering': 3200, 'Engineer': 3200,
      };

      const getCap = (cat: string): number => {
        const normalized = cat.trim();
        let cap = maxCaps[normalized] || 5000;
        if (cap === 5000) {
          const lower = normalized.toLowerCase();
          if (lower.includes('инжен')) cap = 3200;
          else if (lower.includes('строитель')) cap = 3200;
          else if (lower.includes('it')) cap = 8000;
          else if (lower.includes('программ')) cap = 8000;
        }
        return cap;
      };

      const getFloor = (cat: string): number => {
        const normalized = cat.trim();
        let floor = minFloors[normalized] || 0;
        if (floor === 0) {
          const lower = normalized.toLowerCase();
          if (lower.includes('инжен')) floor = 3200;
          else if (lower.includes('строитель')) floor = 3200;
        }
        return floor;
      };

      const median = (arr: number[]): number => {
        if (arr.length === 0) return 0;
        const sorted = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0
          ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
          : sorted[mid];
      };

      const categories: CategorySalaryStats[] = [];
      let totalSalary = 0;
      let totalCount = 0;

      categoryMap.forEach((data, category) => {
        const cap = getCap(category);
        const floor = getFloor(category);

        const validMins = data.salaryMins.filter(v => v >= 500);
        const validMaxs = data.salaryMaxs.filter(v => v >= 500);

        const avgMin = validMins.length > 0 ? median(validMins) : 0;
        const avgMax = validMaxs.length > 0 ? median(validMaxs) : 0;

        const fallbackMin = validMins.length > 0 ? Math.round(validMins.reduce((a, b) => a + b) / validMins.length) : 0;
        const fallbackMax = validMaxs.length > 0 ? Math.round(validMaxs.reduce((a, b) => a + b) / validMaxs.length) : 0;

        let finalAvgMin = avgMin > 0 ? avgMin : fallbackMin;
        let finalAvgMax = avgMax > 0 ? avgMax : fallbackMax;
        let avgSalary = Math.round((finalAvgMin + finalAvgMax) / 2);

        avgSalary = Math.max(floor, Math.min(avgSalary, cap));
        finalAvgMin = Math.max(floor, Math.min(finalAvgMin, cap));
        finalAvgMax = Math.max(floor, Math.min(finalAvgMax, cap));

        categories.push({ category, avgSalaryMin: finalAvgMin, avgSalaryMax: finalAvgMax, avgSalary, vacancyCount: data.count });
        totalSalary += avgSalary * data.count;
        totalCount += data.count;
      });

      categories.sort((a, b) => b.avgSalary - a.avgSalary);

      return {
        categories,
        totalVacancies: vacancies.length || 0,
        overallAvgSalary: totalCount > 0 ? Math.round(totalSalary / totalCount) : 0,
        lastUpdated: lastParsed,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}
