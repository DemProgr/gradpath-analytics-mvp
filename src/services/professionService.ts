import { api } from '@/lib/api/client';

interface ProfessionFilters {
  demandLevel?: string;
  category?: string;
  city?: string;
  year?: number;
  searchQuery?: string;
}

interface ProfessionAnalytics {
  id: number;
  profession_name: string;
  category: string;
  demand_level: string;
  forecast_year: number;
  forecast_source: string;
  forecast_city: string;
  description: string;
  related_specialties: string[];
  avg_salary: number;
  min_salary: number;
  max_salary: number;
  vacancies_count: number;
  salary_year: number;
  salary_month: number;
  salary_source: string;
  overall_rating: string;
}

interface CareerPath {
  specialty_category: string;
  levels: {
    level_name: string;
    level_order: number;
    typical_salary_min: number;
    typical_salary_max: number;
    years_experience: string;
    description: string;
  }[];
}

interface ProfessionStats {
  total: number;
  byDemand: { high: number; medium: number; low: number };
  byCategory?: { worker: number; employee: number; specialist: number };
  avgSalary?: number;
  topProfessions?: ProfessionAnalytics[];
}

export class ProfessionService {
  static async getProfessions(filters: ProfessionFilters = {}): Promise<ProfessionAnalytics[]> {
    const params = new URLSearchParams();
    if (filters.demandLevel && filters.demandLevel !== 'all') params.set('demand', filters.demandLevel);
    if (filters.category && filters.category !== 'all') params.set('category', filters.category);
    if (filters.city && filters.city !== 'all') params.set('city', filters.city);
    if (filters.year) params.set('year', String(filters.year));
    if (filters.searchQuery) params.set('search', filters.searchQuery);

    return api.get(`/api/professions/analytics?${params}`);
  }

  static async getTopProfessions(limit: number = 10): Promise<ProfessionAnalytics[]> {
    return api.get(`/api/professions/top?limit=${limit}`);
  }

  static async getProfessionByName(name: string): Promise<ProfessionAnalytics | null> {
    const all = await this.getProfessions({ searchQuery: name });
    return all.find(p => p.profession_name === name) || null;
  }

  static async getProfessionsByDemand(demandLevel: string): Promise<ProfessionAnalytics[]> {
    return this.getProfessions({ demandLevel });
  }

  static async getProfessionsByCategory(category: string): Promise<ProfessionAnalytics[]> {
    return this.getProfessions({ category });
  }

  static async getCities(): Promise<string[]> {
    return api.get('/api/professions/cities');
  }

  static async getStats(): Promise<ProfessionStats> {
    return api.get('/api/professions/stats');
  }

  static async getCareerPath(category: string): Promise<CareerPath | null> {
    const data = await api.get<{ level_name: string; level_order: number; typical_salary_min: number; typical_salary_max: number; years_experience: string; description: string }[]>(`/api/career-paths/${encodeURIComponent(category)}`);
    if (!data || data.length === 0) return null;
    return {
      specialty_category: category,
      levels: data.map(d => ({
        level_name: d.level_name,
        level_order: d.level_order,
        typical_salary_min: d.typical_salary_min,
        typical_salary_max: d.typical_salary_max,
        years_experience: d.years_experience,
        description: d.description,
      })),
    };
  }

  static async searchBySpecialty(specialty: string): Promise<ProfessionAnalytics[]> {
    return api.get(`/api/professions/search?q=${encodeURIComponent(specialty)}`);
  }

  static async getSalaryHistory(professionName: string): Promise<{ month: number; avg_salary: number; vacancies_count: number }[]> {
    return api.get(`/api/professions/salaries?profession=${encodeURIComponent(professionName)}`);
  }
}
