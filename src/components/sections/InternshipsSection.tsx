import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, DollarSign, ExternalLink, Search, Filter, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface Internship {
  id: string;
  title: string;
  company: string;
  city: string;
  salary: string;
  duration: string;
  type: 'paid' | 'unpaid' | 'payed';
  category: string;
  requirements: string[];
  postedDate: string;
  link: string;
}

const internshipsData: Internship[] = [
  {
    id: '1',
    title: 'Frontend-разработчик (стажировка)',
    company: 'Wargaming',
    city: 'Минск',
    salary: '800-1200 BYN',
    duration: '3-6 месяцев',
    type: 'paid',
    category: 'ИТ',
    requirements: ['JavaScript', 'React', 'HTML/CSS', 'Английский B1+'],
    postedDate: '2 дня назад',
    link: 'https://wargaming.com',
  },
  {
    id: '2',
    title: 'Python Developer Intern',
    company: 'EPAM Systems',
    city: 'Минск',
    salary: '600-1000 BYN',
    duration: '3 месяца',
    type: 'paid',
    category: 'ИТ',
    requirements: ['Python', 'SQL', 'Git', 'Английский B2'],
    postedDate: '3 дня назад',
    link: 'https://epam.com',
  },
  {
    id: '3',
    title: 'Маркетинг-ассистент',
    company: 'Белтелеком',
    city: 'Минск',
    salary: '500 BYN',
    duration: '6 месяцев',
    type: 'paid' as const,
    category: 'Маркетинг',
    requirements: ['SMM', 'Копирайтинг', 'Photoshop'],
    postedDate: '1 неделю назад',
    link: 'https://beltelecom.by',
  },
  {
    id: '4',
    title: 'Стажер-бухгалтер',
    company: 'Делойт',
    city: 'Минск',
    salary: '400-600 BYN',
    duration: '6 месяцев',
    type: 'paid',
    category: 'Финансы',
    requirements: ['1C', 'Excel', 'Английский B2'],
    postedDate: '5 дней назад',
    link: 'https://deloitte.com',
  },
  {
    id: '5',
    title: 'QA Engineer (стажировка)',
    company: 'ISsoft',
    city: 'Минск',
    salary: '500-800 BYN',
    duration: '2-4 месяца',
    type: 'paid',
    category: 'ИТ',
    requirements: ['Тестирование', 'SQL', 'Техническая документация'],
    postedDate: '1 день назад',
    link: 'https://issoft.by',
  },
  {
    id: '6',
    title: 'Помощник юриста',
    company: 'Ревега',
    city: 'Минск',
    salary: '300-500 BYN',
    duration: '6 месяцев',
    type: 'paid' as const,
    category: 'Юриспруденция',
    requirements: ['Высшее юридическое (студент 4-5 курс)', 'MS Office'],
    postedDate: '4 дня назад',
    link: 'https://revega.by',
  },
  {
    id: '7',
    title: 'Data Science стажер',
    company: 'AITer',
    city: 'Минск',
    salary: '700-1200 BYN',
    duration: '3-6 месяцев',
    type: 'paid' as const,
    category: 'ИТ',
    requirements: ['Python', 'Machine Learning', 'TensorFlow', 'Английский B2'],
    postedDate: '6 дней назад',
    link: 'https://aiter.io',
  },
  {
    id: '8',
    title: 'Стажер-инженер',
    company: 'МТЗ',
    city: 'Минск',
    salary: '400 BYN',
    duration: '6 месяцев',
    type: 'paid' as const,
    category: 'Инженерия',
    requirements: ['Техническое образование', 'AutoCAD'],
    postedDate: '1 неделю назад',
    link: 'https://mtz.by',
  },
];

interface InternshipsSectionProps {
  className?: string;
}

export function InternshipsSection({ className }: InternshipsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');

  const filteredInternships = internshipsData.filter(internship => {
    const matchesSearch = !searchQuery || 
      internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || internship.category === categoryFilter;
    const matchesCity = cityFilter === 'all' || internship.city === cityFilter;
    return matchesSearch && matchesCategory && matchesCity;
  });

  const categories = ['all', ...new Set(internshipsData.map(i => i.category))];
  const cities = ['all', ...new Set(internshipsData.map(i => i.city))];

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'paid':
        return <Badge className="bg-green-500">Платно</Badge>;
      case 'unpaid':
        return <Badge variant="outline">Без оплаты</Badge>;
      default:
        return <Badge variant="secondary">Стажировка</Badge>;
    }
  };

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

        {/* Filters */}
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
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'all' ? 'Все направления' : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Город" />
            </SelectTrigger>
            <SelectContent>
              {cities.map(city => (
                <SelectItem key={city} value={city}>
                  {city === 'all' ? 'Все города' : city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-primary/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-primary">{internshipsData.length}</p>
            <p className="text-sm text-muted-foreground">Всего стажировок</p>
          </div>
          <div className="bg-green-500/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-500">{internshipsData.filter(i => i.type === 'paid').length}</p>
            <p className="text-sm text-muted-foreground">Платно</p>
          </div>
          <div className="bg-blue-500/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-500">{internshipsData.filter(i => i.category === 'ИТ').length}</p>
            <p className="text-sm text-muted-foreground">IT стажировки</p>
          </div>
          <div className="bg-amber-500/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-amber-500">{new Set(internshipsData.map(i => i.company)).size}</p>
            <p className="text-sm text-muted-foreground">Компаний</p>
          </div>
        </div>

        {/* Internships List */}
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
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {internship.city}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {internship.salary}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {internship.duration}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {internship.requirements.map(req => (
                      <Badge key={req} variant="outline" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">{internship.postedDate}</span>
                    <Button size="sm" asChild>
                      <a href={internship.link} target="_blank" rel="noopener noreferrer">
                        Откликнуться
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
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
              onClick={() => { setSearchQuery(''); setCategoryFilter('all'); setCityFilter('all'); }}
            >
              Сбросить фильтры
            </Button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Button variant="outline" size="lg">
            Показать больше стажировок
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
