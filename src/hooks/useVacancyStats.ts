import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';

export interface VacancyStats {
  category: string;
  count: number;
  avgSalaryMin: number;
  avgSalaryMax: number;
  avgSalary: number;
}

export function useVacancyStats() {
  const [stats, setStats] = useState<VacancyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);

        const countData = await api.get<{ count: number }>('/api/vacancies/count');
        setTotalCount(countData.count || 0);

        const rpcData = await api.get<any[]>('/api/vacancies/stats');

        if (!rpcData || rpcData.length === 0) {
          setStats([]);
          return;
        }

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

        const formattedStats: VacancyStats[] = rpcData.map((row: any) => {
          const category = row.category;
          const cap = getCap(category);
          const floor = getFloor(category);
          let avgSalaryMin = Number(row.avg_salary_min) || 0;
          let avgSalaryMax = Number(row.avg_salary_max) || 0;
          let avgSalary = Number(row.avg_salary) || 0;

          avgSalary = Math.max(floor, Math.min(avgSalary, cap));
          avgSalaryMin = Math.max(floor, Math.min(avgSalaryMin, cap));
          avgSalaryMax = Math.max(floor, Math.min(avgSalaryMax, cap));

          return { category, count: Number(row.count), avgSalaryMin, avgSalaryMax, avgSalary };
        }).sort((a, b) => b.count - a.count);

        setStats(formattedStats);
      } catch (err) {
        console.error('Error fetching vacancy stats:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error, totalCount };
}
