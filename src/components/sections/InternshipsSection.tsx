import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, DollarSign, ExternalLink, Search, GraduationCap, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api/client';

interface Internship {
  id: number;
  title: string;
  company: string;
  city: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;
  duration: string | null;
  type: 'paid' | 'unpaid' | 'unknown';
  category: string;
  requirements: string[] | null;
  description: string | null;
  link: string | null;
  postedAt: string;
}

interface Stats {
  total: number;
  paid_count: number;
  it_count: number;
  company_count: number;
}

interface InternshipsSectionProps {
  className?: string;
}

export function InternshipsSection({ className }: InternshipsSectionProps) {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    Promise.all([
      api.get<Internship[]>('/api/internships'),
      api.get<Stats>('/api/internships/stats'),
      api.get<string[]>('/api/internships/categories'),
      api.get<string[]>('/api/internships/cities'),
    ])
      .then(([items, s, cats, cts]) => {
        setInternships(items || []);
        setStats(s);
        setCategories(cats || []);
        setCities(cts || []);
      })
      .catch((err) => {
        setError(err.message || 'Не удалось загрузить стажировки');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = !searchQuery || 
      internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || internship.category === categoryFilter;
    const matchesCity = cityFilter === 'all' || internship.city === cityFilter;
    const matchesType = typeFilter === 'all' || internship.type === typeFilter;
    return matchesSearch && matchesCategory && matchesCity && matchesType;
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'paid':
        return <Badge className="bg-green-500">Платно</Badge>;
      case 'unpaid':
        return <Badge variant="outline">Без оплаты</Badge>;
      default:
        return <Badge variant="secondary">Уточняется</Badge>;
    }
  };

  const formatSalary = (min: number | null, max: number | null, currency: string | null) => {
    if (min && max) return `${min}-${max} ${currency || 'BYN'}`;
    if (min) return `от ${min} ${currency || 'BYN'}`;
    if (max) return `до ${max} ${currency || 'BYN'}`;
    return 'Не указана';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Вчера';
    if (diffDays < 7) return `${diffDays} дня назад`;
    return date.toLocaleDateString('ru-RU');
  };

  if (loading) {
    return (
      <section className={cn("py-16", className)}>
        <div className="section-container flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={cn("py-16", className)}>
        <div className="section-container text-center py-20">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Повторить</Button>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("py-16 bg-card", className)}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-display font-bold text-foreground">
              Стажировки для студентов
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Актуальные стажировки и вакансии для студентов и выпускников в Беларуси.
            Начните свою карьеру уже во время учебы.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Поиск по названию или компании..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Направление" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все направления</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Город" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все города</SelectItem>
              {cities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Тип" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы</SelectItem>
              <SelectItem value="paid">Платные</SelectItem>
              <SelectItem value="unpaid">Без оплаты</SelectItem>
              <SelectItem value="unknown">Уточняется</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-primary/5 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-primary">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Всего стажировок</p>
            </div>
            <div className="bg-green-500/5 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-500">{stats.paid_count}</p>
              <p className="text-sm text-muted-foreground">Платно</p>
            </div>
            <div className="bg-blue-500/5 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-500">{stats.it_count}</p>
              <p className="text-sm text-muted-foreground">IT стажировки</p>
            </div>
            <div className="bg-amber-500/5 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-amber-500">{stats.company_count}</p>
              <p className="text-sm text-muted-foreground">Компаний</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredInternships.map((internship, index) => (
            <motion.div
              key={internship.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{internship.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Briefcase className="w-3 h-3" />
                        {internship.company}
                      </CardDescription>
                    </div>
                    {getTypeBadge(internship.type)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    {internship.city && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {internship.city}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {formatSalary(internship.salaryMin, internship.salaryMax, internship.salaryCurrency)}
                    </div>
                    {internship.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {internship.duration}
                      </div>
                    )}
                  </div>

                  {internship.requirements && internship.requirements.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {internship.requirements.map(req => (
                        <Badge key={req} variant="outline" className="text-xs">{req}</Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">{formatDate(internship.postedAt)}</span>
                    {internship.link ? (
                      <Button size="sm" asChild>
                        <a href={internship.link} target="_blank" rel="noopener noreferrer">
                          Откликнуться
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        Скоро
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredInternships.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">По вашему запросу ничего не найдено</p>
            <Button
              variant="link"
              onClick={() => { setSearchQuery(''); setCategoryFilter('all'); setCityFilter('all'); setTypeFilter('all'); }}
            >
              Сбросить фильтры
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
