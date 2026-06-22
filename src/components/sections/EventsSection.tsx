import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Building2, ExternalLink, Search, Loader2, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api/client';

interface EventItem {
  id: number;
  title: string;
  organizer: string;
  organizerType: string;
  date: string;
  endDate: string | null;
  time: string | null;
  city: string | null;
  format: string;
  type: string;
  description: string | null;
  link: string | null;
  tags: string[] | null;
}

interface Stats {
  total: number;
  upcoming: number;
  organizers: number;
  cities: number;
}

const FORMAT_LABELS: Record<string, string> = {
  offline: 'Офлайн',
  online: 'Онлайн',
  hybrid: 'Гибрид',
};

const FORMAT_COLORS: Record<string, string> = {
  offline: 'bg-blue-500',
  online: 'bg-green-500',
  hybrid: 'bg-purple-500',
};

const TYPE_LABELS: Record<string, string> = {
  career_fair: 'Ярмарка вакансий',
  open_day: 'День открытых дверей',
  meetup: 'Митап',
  workshop: 'Воркшоп',
  lecture: 'Лекция',
  other: 'Другое',
};

const ORG_LABELS: Record<string, string> = {
  company: 'Компания',
  university: 'ВУЗ',
  student_org: 'Студ. организация',
  other: 'Другое',
};

interface EventsSectionProps {
  className?: string;
}

export function EventsSection({ className }: EventsSectionProps) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [formatFilter, setFormatFilter] = useState('all');
  const [tab, setTab] = useState<'all' | 'upcoming'>('all');

  useEffect(() => {
    Promise.all([
      api.get<EventItem[]>('/api/events'),
      api.get<Stats>('/api/events/stats'),
      api.get<string[]>('/api/events/cities'),
    ])
      .then(([items, s, cts]) => {
        setEvents(items || []);
        setStats(s);
        setCities(cts || []);
      })
      .catch((err) => {
        setError(err.message || 'Не удалось загрузить мероприятия');
      })
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const filteredEvents = events
    .filter(e => tab === 'all' || e.date >= today)
    .filter(e => {
      const matchesSearch = !searchQuery ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.organizer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || e.type === typeFilter;
      const matchesCity = cityFilter === 'all' || e.city === cityFilter;
      const matchesFormat = formatFilter === 'all' || e.format === formatFilter;
      return matchesSearch && matchesType && matchesCity && matchesFormat;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const formatDate = (dateStr: string, endDateStr: string | null) => {
    const d = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    let result = d.toLocaleDateString('ru-RU', options);
    if (endDateStr) {
      const end = new Date(endDateStr);
      result += ` – ${end.toLocaleDateString('ru-RU', options)}`;
    }
    return result;
  };

  const isPast = (dateStr: string) => dateStr < today;

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
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-display font-bold text-foreground">
              Карьерные мероприятия
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Ярмарки вакансий, дни открытых дверей, митапы и воркшопы для студентов и выпускников.
          </p>
        </motion.div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-primary/5 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-primary">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Всего мероприятий</p>
            </div>
            <div className="bg-green-500/5 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-500">{stats.upcoming}</p>
              <p className="text-sm text-muted-foreground">Предстоящих</p>
            </div>
            <div className="bg-blue-500/5 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-500">{stats.organizers}</p>
              <p className="text-sm text-muted-foreground">Организаторов</p>
            </div>
            <div className="bg-amber-500/5 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-amber-500">{stats.cities}</p>
              <p className="text-sm text-muted-foreground">Городов</p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Поиск по названию или организатору..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Тип" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы</SelectItem>
              {Object.entries(TYPE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
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
          <Select value={formatFilter} onValueChange={setFormatFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Формат" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все форматы</SelectItem>
              {Object.entries(FORMAT_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 mb-8">
          <Button
            variant={tab === 'upcoming' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTab('upcoming')}
          >
            Предстоящие
          </Button>
          <Button
            variant={tab === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTab('all')}
          >
            Все
          </Button>
        </div>

        <div className="space-y-3">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className={cn(
                "hover:shadow-md transition-shadow",
                isPast(event.date) && "opacity-60"
              )}>
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-shrink-0 text-center md:w-20">
                      <p className="text-2xl font-bold text-primary">
                        {new Date(event.date).getDate()}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase">
                        {new Date(event.date).toLocaleDateString('ru-RU', { month: 'short' })}
                      </p>
                      {event.endDate && (
                        <p className="text-[10px] text-muted-foreground">
                          –{new Date(event.endDate).getDate()}
                        </p>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 flex-wrap">
                        <h3 className="font-semibold text-base">{event.title}</h3>
                        <Badge variant="outline" className="text-[10px]">
                          {TYPE_LABELS[event.type] || event.type}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {event.organizer}
                          <span className="text-[10px] text-muted-foreground/60">
                            ({ORG_LABELS[event.organizerType] || event.organizerType})
                          </span>
                        </span>
                        {event.city && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {event.city}
                          </span>
                        )}
                        {event.time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {event.time}
                          </span>
                        )}
                      </div>

                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {event.description}
                        </p>
                      )}

                      {event.tags && event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {event.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-[10px]">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className={cn(
                        "text-[10px] font-medium px-2 py-0.5 rounded-full text-white",
                        FORMAT_COLORS[event.format] || 'bg-gray-500'
                      )}>
                        {FORMAT_LABELS[event.format] || event.format}
                      </div>
                      {event.link ? (
                        <Button size="sm" asChild>
                          <a href={event.link} target="_blank" rel="noopener noreferrer">
                            Записаться
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          Скоро
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">По вашему запросу ничего не найдено</p>
            <Button
              variant="link"
              onClick={() => { setSearchQuery(''); setTypeFilter('all'); setCityFilter('all'); setFormatFilter('all'); }}
            >
              Сбросить фильтры
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
