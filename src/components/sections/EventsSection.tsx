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
import { useLanguage } from '@/hooks/useLanguage';

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

const FORMAT_COLORS: Record<string, string> = {
  offline: 'bg-blue-500',
  online: 'bg-green-500',
  hybrid: 'bg-purple-500',
};

interface EventsSectionProps {
  className?: string;
}

export function EventsSection({ className }: EventsSectionProps) {
  const { t, language } = useLanguage();
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
        setError(err.message || t('events.loadError'));
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

  const locale = language === 'en' ? 'en-US' : language === 'be' ? 'be-BY' : 'ru-RU';

  const formatDate = (dateStr: string, endDateStr: string | null) => {
    const d = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    let result = d.toLocaleDateString(locale, options);
    if (endDateStr) {
      const end = new Date(endDateStr);
      result += ` – ${end.toLocaleDateString(locale, options)}`;
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
          <Button onClick={() => window.location.reload()}>{t('events.retry')}</Button>
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
              {t('events.title')}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            {t('events.subtitle')}
          </p>
        </motion.div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-primary/5 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-primary">{stats.total}</p>
              <p className="text-sm text-muted-foreground">{t('events.statsTotal')}</p>
            </div>
            <div className="bg-green-500/5 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-500">{stats.upcoming}</p>
              <p className="text-sm text-muted-foreground">{t('events.statsUpcoming')}</p>
            </div>
            <div className="bg-blue-500/5 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-500">{stats.organizers}</p>
              <p className="text-sm text-muted-foreground">{t('events.statsOrganizers')}</p>
            </div>
            <div className="bg-amber-500/5 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-amber-500">{stats.cities}</p>
              <p className="text-sm text-muted-foreground">{t('events.statsCities')}</p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t('events.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('events.filterType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('events.allTypes')}</SelectItem>
              {['career_fair', 'open_day', 'meetup', 'workshop', 'lecture', 'other'].map(k => (
                <SelectItem key={k} value={k}>{t(`events.type${k.charAt(0).toUpperCase() + k.slice(1).replace(/_([a-z])/g, (_, c) => c.toUpperCase())}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={t('events.filterCity')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('events.allCities')}</SelectItem>
              {cities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={formatFilter} onValueChange={setFormatFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={t('events.filterFormat')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('events.allFormats')}</SelectItem>
              {['offline', 'online', 'hybrid'].map(k => (
                <SelectItem key={k} value={k}>{t(`events.format${k.charAt(0).toUpperCase() + k.slice(1)}`)}</SelectItem>
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
            {t('events.tabUpcoming')}
          </Button>
          <Button
            variant={tab === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTab('all')}
          >
            {t('events.tabAll')}
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
                        {new Date(event.date).toLocaleDateString(locale, { month: 'short' })}
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
                          {t(`events.type${event.type.charAt(0).toUpperCase() + event.type.slice(1).replace(/_([a-z])/g, (_, c) => c.toUpperCase())}`) || event.type}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {event.organizer}
                          <span className="text-[10px] text-muted-foreground/60">
                            ({t(`events.org${event.organizerType.charAt(0).toUpperCase() + event.organizerType.slice(1).replace(/_([a-z])/g, (_, c) => c.toUpperCase())}`) || event.organizerType})
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
                        {t(`events.format${event.format.charAt(0).toUpperCase() + event.format.slice(1)}`) || event.format}
                      </div>
                      {event.link ? (
                        <Button size="sm" asChild>
                          <a href={event.link} target="_blank" rel="noopener noreferrer">
                            {t('events.register')}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          {t('events.soon')}
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
            <p className="text-muted-foreground">{t('events.empty')}</p>
            <Button
              variant="link"
              onClick={() => { setSearchQuery(''); setTypeFilter('all'); setCityFilter('all'); setFormatFilter('all'); }}
            >
              {t('events.resetFilters')}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
