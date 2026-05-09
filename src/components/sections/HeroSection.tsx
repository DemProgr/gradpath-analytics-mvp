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
    <section className="min-h-screen flex flex-col justify-center pt-20 pb-12 px-0">
      <div className="w-full">
        {/* Full Width Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <div className="relative w-full" style={{ height: '100vh' }}>
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

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium text-foreground leading-tight mb-4">
            {t('hero.title')}
          </h1>
        </motion.div>

        {/* Search Box - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-xl mx-auto mb-10 relative"
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
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
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

        {/* Quick Stats - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-center justify-center gap-8 sm:gap-12 mb-10"
        >
          {quickStats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-serif font-semibold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            onClick={() => onNavigate('universities')}
            className="btn-primary flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            {t('hero.chooseUni')}
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <a 
            href="/applicants"
            className="btn-outline flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            {t('hero.forApplicants')}
          </a>
          <a 
            href="/statistics"
            className="btn-outline flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            {t('hero.analytics')}
          </a>
          {!user && (
            <a 
              href="/register"
              className="btn-secondary flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {t('hero.register')}
            </a>
          )}
        </motion.div>

        {/* Data Source Notice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          {t('hero.dataNotice')}
        </motion.p>
      </div>
    </section>
  );
}