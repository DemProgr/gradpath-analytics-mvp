import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage, translateCategory } from '@/hooks/useLanguage';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { 
  ExternalLink, Search, ChevronLeft, ChevronRight, 
  SlidersHorizontal, X, MapPin, Building 
} from 'lucide-react';

interface Vacancy {
  id: string;
  title: string;
  company: string | null;
  city: string | null;
  category: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  source_url: string | null;
  parsed_at: string;
}

export function AllVacanciesTable() {
  const { t, language } = useLanguage();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 10000]);
  
  const itemsPerPage = 50;

  // Fetch distinct categories and cities for filters
  useEffect(() => {
    async function fetchFilterOptions() {
      try {
        const data = await api.get<any[]>('/api/vacancies?limit=10000');
        
        const uniqueCategories = Array.from(new Set((data || []).map(v => v.category).filter(Boolean)));
        const uniqueCities = Array.from(new Set((data || []).map(v => v.city).filter(Boolean)));
        
        setCategories(uniqueCategories.sort());
        setCities(uniqueCities.sort());
      } catch (err) {
        console.error('Error fetching filter options:', err);
      }
    }
    fetchFilterOptions();
  }, []);

  // Fetch vacancies with pagination
  useEffect(() => {
    fetchVacancies();
  }, [currentPage]);

  async function fetchVacancies() {
    try {
      setLoading(true);
      
      const { count } = await api.get<{ count: number }>('/api/vacancies/count');
      setTotalCount(count || 0);
      
      const data = await api.get<any[]>(`/api/vacancies?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}`);
      setVacancies(data || []);
    } catch (err) {
      console.error('Error fetching vacancies:', err);
    } finally {
      setLoading(false);
    }
  }

  // Apply filters on current page data
  const filteredVacancies = useMemo(() => {
    let result = vacancies;
    
    // Search (title, company, city, category)
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      result = result.filter(v => 
        v.title.toLowerCase().includes(query) ||
        (v.company && v.company.toLowerCase().includes(query)) ||
        (v.city && v.city.toLowerCase().includes(query)) ||
        (v.category && v.category.toLowerCase().includes(query))
      );
    }
    
    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(v => v.category === selectedCategory);
    }
    
    // City filter
    if (selectedCity !== 'all') {
      result = result.filter(v => v.city === selectedCity);
    }
    
    // Salary range filter (0-10000 BYN)
    const [minSalary, maxSalary] = salaryRange;
    result = result.filter(v => {
      if (!v.salary_min && !v.salary_max) return true;
      const avg = (v.salary_min || 0 + v.salary_max || 0) / 2;
      return avg >= minSalary && avg <= maxSalary;
    });
    
    return result;
  }, [vacancies, searchTerm, selectedCategory, selectedCity, salaryRange]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedCity, salaryRange]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="space-y-4"
    >
      {/* Filters Bar */}
      <div className="flex flex-col gap-4 p-4 bg-card rounded-xl border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Фильтры</span>
            {(searchTerm || selectedCategory !== 'all' || selectedCity !== 'all' || salaryRange[0] > 0 || salaryRange[1] < 10000) && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                Активны
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedCity('all');
                setSalaryRange([0, 10000]);
              }}
            >
              <X className="w-3 h-3 mr-1" />
              Сбросить
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Скрыть' : 'Показать'}
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4 pt-4 border-t border-border"
          >
            {/* Category and City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Категория</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Все категории" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все категории</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{translateCategory(cat, language)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Город</Label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Все города" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все города</SelectItem>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Salary Range */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground flex justify-between">
                <span>Диапазон зарплаты (BYN)</span>
                <span className="text-foreground">{salaryRange[0].toLocaleString()} - {salaryRange[1].toLocaleString()}</span>
              </Label>
              <Slider
                value={salaryRange}
                onValueChange={(value) => setSalaryRange([value[0], value[1]])}
                min={0}
                max={10000}
                step={100}
                minStepsBetweenThumbs={2}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Search and stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию, компании, городу..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchTerm('')}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          Всего в базе: <span className="font-semibold text-foreground">{totalCount}</span> вакансий
          {(searchTerm || selectedCategory !== 'all' || selectedCity !== 'all' || salaryRange[0] > 0 || salaryRange[1] < 10000) && (
            <> • Отфильтровано: <span className="font-semibold text-foreground">{filteredVacancies.length}</span></>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 bg-secondary/50">
                <TableHead className="text-muted-foreground">{t('stats.vacancy')}</TableHead>
                <TableHead className="text-muted-foreground">{t('stats.company')}</TableHead>
                <TableHead className="text-muted-foreground">{t('stats.city')}</TableHead>
                <TableHead className="text-muted-foreground">{t('stats.category')}</TableHead>
                <TableHead className="text-muted-foreground text-right">{t('stats.salary')}</TableHead>
                <TableHead className="text-muted-foreground">{t('stats.source')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredVacancies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    {searchTerm || selectedCategory !== 'all' || selectedCity !== 'all' || salaryRange[0] > 0 || salaryRange[1] < 10000 ? 
                      'Нет вакансий, соответствующих фильтрам' : 
                      'Нет данных о вакансиях'}
                    {(searchTerm || selectedCategory !== 'all' || selectedCity !== 'all' || salaryRange[0] > 0 || salaryRange[1] < 10000) && (
                      <div className="mt-4">
                        <Button variant="link" onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('all');
                          setSelectedCity('all');
                          setSalaryRange([0, 10000]);
                        }}>
                          Сбросить все фильтры
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredVacancies.map((vacancy) => (
                  <TableRow 
                    key={vacancy.id}
                    className="border-border/30 hover:bg-secondary/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{vacancy.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(vacancy.parsed_at).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {vacancy.company || '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {vacancy.city || '—'}
                    </TableCell>
                    <TableCell>
                      {vacancy.category ? (
                        <Badge variant="secondary" className="text-xs">
                          {translateCategory(vacancy.category, language)}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {vacancy.salary_min || vacancy.salary_max ? (
                        <div className="flex flex-col">
                          <span className="font-semibold text-primary">
                            {vacancy.salary_min?.toLocaleString('ru-RU') || '—'} - {vacancy.salary_max?.toLocaleString('ru-RU') || '—'}
                          </span>
                          <span className="text-xs text-muted-foreground">{vacancy.salary_currency}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {vacancy.source_url ? (
                        <a 
                          href={vacancy.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          rabota.by
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-border/50">
          <div className="text-sm text-muted-foreground">
            Страница {currentPage} из {totalPages}
            {(searchTerm || selectedCategory !== 'all' || selectedCity !== 'all' || salaryRange[0] > 0 || salaryRange[1] < 10000) && (
              <> • Показано: <span className="font-semibold text-foreground">{filteredVacancies.length}</span> из <span className="font-semibold text-foreground">{totalCount}</span></>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
