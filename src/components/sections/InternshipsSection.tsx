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
import { useLanguage } from '@/hooks/useLanguage';

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
  const { t } = useLanguage();
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
        setError(err.message || t('internships.loadError'));
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
        return <Badge className="bg-green-500">{t('internships.badgePaid')}</Badge>;
      case 'unpaid':
        return <Badge variant="outline">{t('internships.badgeUnpaid')}</Badge>;
      default:
        return <Badge variant="secondary">{t('internships.badgeUnknown')}</Badge>;
    }
  };

  const formatSalary = (min: number | null, max: number | null, currency: string | null) => {
    if (min && max) return `${min}-${max} ${currency || 'BYN'}`;
    if (min) return `${t('internships.salaryFrom', { value: `${min} ${currency || 'BYN'}` })}`;
    if (max) return `${t('internships.salaryTo', { value: `${max} ${currency || 'BYN'}` })}`;
    return t('internships.salaryNotSpecified');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return t('internships.today');
    if (diffDays === 1) return t('internships.yesterday');
    if (diffDays < 7) return t('internships.daysAgo', { days: diffDays });
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
          <Button onClick={() => window.location.reload()}>{t('internships.retry')}</Button>
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
              {t('internships.title')}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            {t('internships.subtitle')}
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t('internships.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('internships.filterDirection')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('internships.allDirections')}</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={t('internships.filterCity')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('internships.allCities')}</SelectItem>
              {cities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={t('internships.filterType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('internships.allTypes')}</SelectItem>
              <SelectItem value="paid">{t('internships.typePaid')}</SelectItem>
              <SelectItem value="unpaid">{t('internships.typeUnpaid')}</SelectItem>
              <SelectItem value="unknown">{t('internships.typeUnknown')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-primary/5 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-primary">{stats.total}</p>
              <p className="text-sm text-muted-foreground">{t('internships.statsTotal')}</p>
            </div>
            <div className="bg-green-500/5 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-500">{stats.paid_count}</p>
              <p className="text-sm text-muted-foreground">{t('internships.statsPaid')}</p>
            </div>
            <div className="bg-blue-500/5 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-500">{stats.it_count}</p>
              <p className="text-sm text-muted-foreground">{t('internships.statsIt')}</p>
            </div>
            <div className="bg-amber-500/5 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-amber-500">{stats.company_count}</p>
              <p className="text-sm text-muted-foreground">{t('internships.statsCompanies')}</p>
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
                          {t('internships.apply')}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        {t('internships.soon')}
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
            <p className="text-muted-foreground">{t('internships.empty')}</p>
            <Button
              variant="link"
              onClick={() => { setSearchQuery(''); setCategoryFilter('all'); setCityFilter('all'); setTypeFilter('all'); }}
            >
              {t('internships.resetFilters')}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
