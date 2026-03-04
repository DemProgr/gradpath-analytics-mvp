import { motion } from 'framer-motion';
import { VacanciesChart } from '@/components/charts/VacanciesChart';
import { ExportButton } from '@/components/export/ExportButton';
import { useVacancyStats } from '@/hooks/useVacancyStats';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Briefcase, TrendingUp, Wallet, Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

export function VacanciesSection() {
  const { stats, loading } = useVacancyStats();
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [minVacancies, setMinVacancies] = useState(0);
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 20000]);
  const [sortBy, setSortBy] = useState<'category' | 'count' | 'salary'>('count');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort stats
  const filteredStats = useMemo(() => {
    let result = [...stats];
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(s => s.category.toLowerCase().includes(query));
    }
    
    // Min vacancies filter
    if (minVacancies > 0) {
      result = result.filter(s => s.count >= minVacancies);
    }
    
    // Salary range filter
    const [minSalary, maxSalary] = salaryRange;
    result = result.filter(s => {
      if (s.avgSalary <= 0) return false;
      return s.avgSalary >= minSalary && s.avgSalary <= maxSalary;
    });
    
    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'category') {
        comparison = a.category.localeCompare(b.category);
      } else if (sortBy === 'count') {
        comparison = a.count - b.count;
      } else if (sortBy === 'salary') {
        comparison = a.avgSalary - b.avgSalary;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [stats, searchQuery, minVacancies, salaryRange, sortBy, sortOrder]);

  // Calculate aggregate stats from filtered data
  const displayTotalVacancies = filteredStats.reduce((sum, s) => sum + s.count, 0);
  const displayTopCategory = filteredStats.length > 0 ? filteredStats[0] : null;
  const displayAvgSalary = filteredStats.length > 0
    ? filteredStats.reduce((sum, s) => sum + s.avgSalary, 0) / filteredStats.length
    : 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header with Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Анализ вакансий</h2>
        <ExportButton type="vacancies" />
      </div>
      
      {/* Filters Bar */}
      <div className="flex flex-col gap-4 p-4 bg-card rounded-xl border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Фильтры</span>
            {searchQuery && (
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
                setSearchQuery('');
                setMinVacancies(0);
                setSalaryRange([0, 20000]);
                setSortBy('count');
                setSortOrder('desc');
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
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по категории..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Min Vacancies */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground flex justify-between">
                  <span>Мин. вакансий</span>
                  <span className="text-foreground">{minVacancies}</span>
                </Label>
                <Slider
                  value={[minVacancies]}
                  onValueChange={(value) => setMinVacancies(value[0])}
                  min={0}
                  max={Math.max(100, displayTotalVacancies || 100)}
                  step={10}
                />
              </div>
              
              {/* Salary Range */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Зарплата: {salaryRange[0]} - {salaryRange[1]} BYN
                </Label>
                <Slider
                  value={salaryRange}
                  onValueChange={(value) => setSalaryRange([value[0], value[1]])}
                  min={0}
                  max={20000}
                  step={100}
                  minStepsBetweenThumbs={2}
                />
              </div>
              
              {/* Sort By */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Сортировка</Label>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'category' | 'count' | 'salary')}
                    className="flex-1 px-3 py-2 bg-secondary border border-border rounded-md text-sm"
                  >
                    <option value="count">По кол-ву</option>
                    <option value="salary">По зарплате</option>
                    <option value="category">По названию</option>
                  </select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    title={sortOrder === 'asc' ? 'По возрастанию' : 'По убыванию'}
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card rounded-2xl p-4 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <span className="text-muted-foreground text-xs sm:text-sm">Всего вакансий</span>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <p className="text-2xl sm:text-3xl font-bold text-primary">{displayTotalVacancies.toLocaleString()}</p>
          )}
          <p className="text-muted-foreground text-xs sm:text-sm">
            {searchQuery || minVacancies > 0 ? 'отфильтровано' : 'активных'}
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-4 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            </div>
            <span className="text-muted-foreground text-xs sm:text-sm">Топ категория</span>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{displayTopCategory?.category || '—'}</p>
              <p className="text-accent font-semibold text-sm">{displayTopCategory?.count.toLocaleString() || 0} вакансий</p>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-4 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-secondary flex items-center justify-center">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            </div>
            <span className="text-muted-foreground text-xs sm:text-sm">Средняя зарплата</span>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{Math.round(displayAvgSalary).toLocaleString()}</p>
          )}
          <p className="text-muted-foreground text-xs sm:text-sm">BYN</p>
        </motion.div>
      </div>

      {/* Chart */}
      <VacanciesChart />

      {/* Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="chart-container overflow-hidden"
      >
        <h3 className="text-lg font-semibold text-foreground mb-6">Детальная статистика вакансий</h3>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : filteredStats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Нет данных по заданным фильтрам</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery('');
                  setMinVacancies(0);
                  setSalaryRange([0, 20000]);
                }}
              >
                Сбросить фильтры
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="text-muted-foreground">Категория</TableHead>
                  <TableHead className="text-muted-foreground text-right">Вакансий</TableHead>
                  <TableHead className="text-muted-foreground text-right">Ср. зарплата</TableHead>
                  <TableHead className="text-muted-foreground text-right">Доля</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStats.map((stat) => {
                  const percent = displayTotalVacancies > 0 
                    ? ((stat.count / displayTotalVacancies) * 100).toFixed(1) 
                    : '0.0';
                  return (
                    <TableRow 
                      key={stat.category}
                      className="border-border/30 hover:bg-secondary/50 transition-colors"
                    >
                      <TableCell className="font-medium text-foreground">{stat.category}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {stat.count.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-foreground">
                        {stat.avgSalary > 0 ? `${stat.avgSalary.toLocaleString()} BYN` : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={cn(
                          "font-semibold",
                          Number(percent) >= 20 ? "text-accent" : 
                          Number(percent) >= 10 ? "text-primary" : "text-muted-foreground"
                        )}>
                          {percent}%
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </motion.div>
    </div>
  );
}
