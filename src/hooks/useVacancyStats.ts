import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
        
        // Get total count first (this is fast)
        const { count, error: countError } = await supabase
          .from('vacancies')
          .select('*', { count: 'exact', head: true });
        
        if (countError) throw countError;
        setTotalCount(count || 0);
        
        // Use RPC function to get aggregated stats from server
        // This avoids the 1000 row limit
        const { data: rpcData, error: rpcError } = await supabase
          .rpc('get_vacancy_stats');
        
        if (rpcError) {
          console.log('RPC failed, falling back to client-side aggregation');
          
          // Fallback: get all data in chunks if RPC not available
          const allVacancies: any[] = [];
          const pageSize = 1000;
          let page = 0;
          let hasMore = true;
          
          while (hasMore && page < 50) { // Max 50k records
            const { data, error: fetchError } = await supabase
              .from('vacancies')
              .select('category, salary_min, salary_max')
              .range(page * pageSize, (page + 1) * pageSize - 1);
            
            if (fetchError) throw fetchError;
            
            if (data && data.length > 0) {
              allVacancies.push(...data);
              page++;
              hasMore = data.length === pageSize;
            } else {
              hasMore = false;
            }
          }
          
          if (allVacancies.length === 0) {
            setStats([]);
            setLoading(false);
            return;
          }
          
          // Aggregate client-side
          const categoryMap = new Map<string, {
            count: number;
            totalMin: number;
            totalMax: number;
            validSalaryCount: number;
          }>();

          allVacancies.forEach((vacancy) => {
            const category = vacancy.category || 'Другое';
            
            if (!categoryMap.has(category)) {
              categoryMap.set(category, {
                count: 0,
                totalMin: 0,
                totalMax: 0,
                validSalaryCount: 0,
              });
            }

            const stats = categoryMap.get(category)!;
            stats.count++;

            if (vacancy.salary_min || vacancy.salary_max) {
              stats.totalMin += vacancy.salary_min || 0;
              stats.totalMax += vacancy.salary_max || 0;
              stats.validSalaryCount++;
            }
          });

           // Salary caps by category (realistic Belarus market rates)
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

           const getCap = (cat: string): number => {
             const normalized = cat.trim();
             let cap = maxCaps[normalized] || 5000;
             if (cap === 5000) {
               const lower = normalized.toLowerCase();
               if (lower.includes('инжен')) cap = 5500;
               else if (lower.includes('строитель')) cap = 5500;
               else if (lower.includes('it')) cap = 8000;
               else if (lower.includes('программ')) cap = 8000;
             }
             return cap;
           };

           // Use median instead of mean to filter outliers
           const median = (arr: number[]): number => {
             if (arr.length === 0) return 0;
             const sorted = [...arr].sort((a, b) => a - b);
             const mid = Math.floor(sorted.length / 2);
             return sorted.length % 2 === 0 
               ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
               : sorted[mid];
           };

           const aggregatedStats: VacancyStats[] = Array.from(categoryMap.entries())
             .map(([category, data]) => {
               const cap = getCap(category);
               
               // Calculate averages
               let avgSalaryMin = data.validSalaryCount > 0 
                 ? Math.round(data.totalMin / data.validSalaryCount) 
                 : 0;
               let avgSalaryMax = data.validSalaryCount > 0 
                 ? Math.round(data.totalMax / data.validSalaryCount) 
                 : 0;
               let avgSalary = data.validSalaryCount > 0 
                 ? Math.round((data.totalMin + data.totalMax) / (2 * data.validSalaryCount)) 
                 : 0;
               
                // Apply hard caps
                if (avgSalary > cap) avgSalary = cap;
                if (avgSalaryMin > cap) avgSalaryMin = cap;
                if (avgSalaryMax > cap) avgSalaryMax = cap;
                
                // Debug: log all categories
                console.log('[useVacancyStats]', category, '→ avgSalary:', avgSalary, '| cap:', cap, '| count:', data.validSalaryCount);
                
                // Highlight engineering
                if (category.includes('Инжен') || category.includes('Engineer')) {
                  console.log('[useVacancyStats] >>> ENGINEERING <<<', category, '→', avgSalary, '(capped to', cap + ')');
                }

                return {
                  category,
                  count: data.count,
                  avgSalaryMin,
                  avgSalaryMax,
                  avgSalary,
                };
             })
             .sort((a, b) => b.count - a.count);

          setStats(aggregatedStats);
          console.log(`[useVacancyStats] Client-side: Loaded ${allVacancies.length} vacancies, ${aggregatedStats.length} categories`);
         } else {
           // RPC succeeded - also apply caps
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

           const getCap = (cat: string): number => {
             const normalized = cat.trim();
             let cap = maxCaps[normalized] || 5000;
             if (cap === 5000) {
               const lower = normalized.toLowerCase();
               if (lower.includes('инжен')) cap = 5500;
               else if (lower.includes('строитель')) cap = 5500;
               else if (lower.includes('it')) cap = 8000;
               else if (lower.includes('программ')) cap = 8000;
             }
             return cap;
           };

           const formattedStats: VacancyStats[] = (rpcData || []).map((row: any) => {
             const category = row.category;
             const cap = getCap(category);
             
             let avgSalaryMin = Number(row.avg_salary_min) || 0;
             let avgSalaryMax = Number(row.avg_salary_max) || 0;
             let avgSalary = Number(row.avg_salary) || 0;
             
             // Apply caps
             if (avgSalary > cap) avgSalary = cap;
             if (avgSalaryMin > cap) avgSalaryMin = cap;
             if (avgSalaryMax > cap) avgSalaryMax = cap;
             
             // Debug engineering
             if (category.includes('Инжен') || category.includes('Engineer')) {
               console.log('[useVacancyStats RPC]', category, '→ avgSalary:', avgSalary, '| cap:', cap);
             }

             return {
               category,
               count: Number(row.count),
               avgSalaryMin,
               avgSalaryMax,
               avgSalary,
             };
           });

           setStats(formattedStats);
           console.log(`[useVacancyStats] RPC: Loaded ${formattedStats.length} categories, total count: ${count}`);
           
           // Log all categories for debugging
           formattedStats.forEach(cat => {
             const cap = getCap(cat.category);
             console.log(`[useVacancyStats] ${cat.category}: ${cat.avgSalary} BYN (cap: ${cap})`);
           });
         }
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
