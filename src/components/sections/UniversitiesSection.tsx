import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink, GraduationCap, BookOpen, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUniversities } from '@/hooks/useUniversities';
import { useLanguage } from '@/hooks/useLanguage';
import { UNIVERSITY_AVERAGE_MARKS } from '@/data/universityMarks';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ITEMS_PER_PAGE = 12;

export function UniversitiesSection() {
  const { t } = useLanguage();
  const { universities, loading: isLoading } = useUniversities();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCity, setSelectedCity] = useState('all');

  const cities = useMemo(() => {
    if (!universities) return [];
    const uniqueCities = [...new Set(universities.map(uni => uni.city).filter(Boolean))];
    return uniqueCities.sort();
  }, [universities]);

  const filteredUniversities = useMemo(() => {
    if (!universities) return [];
    if (selectedCity === 'all') return universities;
    return universities.filter(uni => uni.city === selectedCity);
  }, [universities, selectedCity]);

  const totalPages = Math.ceil(filteredUniversities.length / ITEMS_PER_PAGE);
  const paginatedUniversities = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUniversities.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUniversities, currentPage]);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const universityCount = filteredUniversities.length;

  const averageMark = Object.values(UNIVERSITY_AVERAGE_MARKS).length > 0 
    ? Math.round(Object.values(UNIVERSITY_AVERAGE_MARKS).reduce((a, b) => a + b, 0) / Object.values(UNIVERSITY_AVERAGE_MARKS).length)
    : 0;

  return (
    <section className="py-12 sm:py-20">
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 sm:mb-16"
        >
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-3">{t('footer.universities')}</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-4">
            {t('unis.title')}
          </h2>
          <p className="text-muted-foreground max-w-xl">
            {t('unis.subtitle')}
          </p>
        </motion.div>

        {/* Key Insights */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-16"
        >
          <div className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">{t('unis.inCatalog')}</span>
            </div>
            <p className="font-serif text-3xl font-semibold">{universityCount}</p>
            <p className="text-sm text-muted-foreground mt-1">{t('unis.universities')}</p>
          </div>
          
          <div className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">{t('unis.totalInRB')}</span>
            </div>
            <p className="font-serif text-3xl font-semibold">53</p>
            <p className="text-sm text-muted-foreground mt-1">{t('unis.institutions')}</p>
          </div>
          
          <div className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">{t('unis.avgScore')}</span>
            </div>
            <p className="font-serif text-3xl font-semibold">{averageMark}</p>
            <p className="text-sm text-muted-foreground mt-1">{t('unis.forAdmission')}</p>
          </div>
        </motion.div>

        {/* Filter and Pagination Top */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
          <div className="w-full sm:w-64">
            <Select value={selectedCity} onValueChange={handleCityChange}>
              <SelectTrigger>
                <SelectValue placeholder="Все города" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все города</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Universities Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Загрузка университетов...
          </div>
        ) : paginatedUniversities.length > 0 ? (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {paginatedUniversities.map((uni, index) => (
              <Link key={uni.id} to={`/university/${encodeURIComponent(uni.short_name)}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="card-elevated p-6 hover:shadow-lg transition-shadow group cursor-pointer h-full"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{uni.city}</span>
                      </div>
                      <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {uni.short_name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{uni.name}</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {UNIVERSITY_AVERAGE_MARKS[uni.short_name] || '-'}
                      </p>
                      <p className="text-xs text-muted-foreground">Балл (2025)</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">{uni.city}</p>
                      <p className="text-xs text-muted-foreground">Город</p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Bottom Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-8 pt-6 border-t border-border">
              <div className="text-sm text-muted-foreground">
                Показано {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredUniversities.length)} из {filteredUniversities.length}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Первая
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-9 h-9 rounded-md transition-colors ${
                        currentPage === pageNum
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Последняя
                </button>
              </div>
            </div>
          )}
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Университеты не найдены.
          </div>
        )}

        {/* Data Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10 p-4 bg-accent/30 rounded-xl"
        >
          <p className="text-xs text-muted-foreground">
            {t('unis.sourceNote')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
