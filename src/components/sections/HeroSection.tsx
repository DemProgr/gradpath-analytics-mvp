import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, GraduationCap, Briefcase, BarChart3, Search, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useUniversities } from '@/hooks/useUniversities';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { universities } = useUniversities();

  const heroImages = ['/design/vuzmain.jpg', '/grodnoimage2.png', '/bntu.png', '/bntu2.png'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [heroImages.length]);
  
  const { data: universityCount } = useQuery({
    queryKey: ['university-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('universities')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: vacancyCount } = useQuery({
    queryKey: ['vacancy-count-hero'],
    queryFn: async () => {
      const { count } = await supabase
        .from('vacancies')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const quickStats = [
    { 
      label: t('hero.unis'), 
      value: universityCount !== undefined ? String(universityCount) : '...',
    },
    { 
      label: t('hero.vacancies'), 
      value: vacancyCount !== undefined ? String(vacancyCount) : '...',
    },
    { 
      label: t('hero.sources'), 
      value: '3+',
    },
  ];

  const searchResults = searchQuery.length >= 2 && universities
    ? universities.filter(uni => 
        (uni.short_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (uni.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (uni.city || '').toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      navigate(`/university/${encodeURIComponent(searchResults[0].short_name)}`);
      setSearchQuery('');
      setShowResults(false);
    }
  };

  const handleSelectResult = (shortName: string) => {
    navigate(`/university/${encodeURIComponent(shortName)}`);
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <section className="min-h-screen flex flex-col justify-center pt-20 pb-8 sm:pb-12 px-4">
      <div className="w-full max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <div className="relative w-full" style={{ height: '40vw', minHeight: '200px', maxHeight: '500px' }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={heroImages[currentImageIndex]}
                alt="Gradpath Analytics"
                className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              />
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="font-serif text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium text-foreground leading-tight mb-2 sm:mb-4">
            {t('hero.title')}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-xl mx-auto mb-6 sm:mb-10 relative"
        >
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('hero.search')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 rounded-xl border border-border bg-background text-foreground text-sm sm:text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </form>
          
          {showResults && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50">
              {searchResults.map((uni) => (
                <button
                  key={uni.id}
                  onClick={() => handleSelectResult(uni.short_name)}
                  className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{uni.short_name}</p>
                    <p className="text-sm text-muted-foreground">{uni.full_name}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{uni.city}</span>
                </button>
              ))}
            </motion.div>
          )}
          
          {showResults && searchQuery.length >= 2 && searchResults.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg p-4 z-50">
              <p className="text-muted-foreground text-sm">{t('hero.noResults')}</p>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-center justify-center gap-6 sm:gap-10 md:gap-12 mb-6 sm:mb-10"
        >
          {quickStats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl sm:text-2xl md:text-3xl font-serif font-semibold text-foreground">{stat.value}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4"
        >
          <button 
            onClick={() => onNavigate('universities')}
            className="btn-primary flex items-center justify-center gap-2 text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3 w-full sm:w-auto">
            <GraduationCap className="w-4 h-4" />
            {t('hero.chooseUni')}
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <a 
            href="/applicants"
            className="btn-outline flex items-center justify-center gap-2 text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3 w-full sm:w-auto">
            <Briefcase className="w-4 h-4" />
            {t('hero.forApplicants')}
          </a>
          <a 
            href="/statistics"
            className="btn-outline flex items-center justify-center gap-2 text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3 w-full sm:w-auto">
            <BarChart3 className="w-4 h-4" />
            {t('hero.analytics')}
          </a>
          {!user && (
            <a 
              href="/register"
              className="btn-secondary flex items-center justify-center gap-2 text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3 w-full sm:w-auto">
              <Sparkles className="w-4 h-4" />
              {t('hero.register')}
            </a>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-[10px] xs:text-xs text-muted-foreground mt-6 sm:mt-8"
        >
          {t('hero.dataNotice')}
        </motion.p>
      </div>
    </section>
  );
}