import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, GraduationCap, Briefcase, BarChart3, Search, UserPlus, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { ALL_UNIVERSITIES } from '@/data/universityMarks';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  
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

  // Search functionality
  const searchResults = searchQuery.length >= 2 
    ? ALL_UNIVERSITIES.filter(uni => 
        uni.short_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.city.toLowerCase().includes(searchQuery.toLowerCase())
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
    <section className="min-h-[80vh] flex flex-col justify-center pt-20 pb-12">
      <div className="section-container">
        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-foreground leading-tight mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {t('hero.subtitle')}
          </p>

          {/* Welcome for authenticated users */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-primary/10 rounded-xl max-w-md mx-auto"
            >
              <p className="text-foreground font-medium">
                {t('hero.welcome')} {user.email?.split('@')[0]}!
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {t('hero.continue')}
              </p>
            </motion.div>
          )}
          
          {/* Quick Search Box */}
          <div className="max-w-xl mx-auto mb-8 relative">
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
            
            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50"
              >
                {searchResults.map((uni) => (
                  <button
                    key={uni.id}
                    onClick={() => handleSelectResult(uni.short_name)}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center justify-between"
                  >
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
                className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg p-4 z-50"
              >
                <p className="text-muted-foreground text-sm">{t('hero.noResults')}</p>
              </motion.div>
            )}
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 mb-8">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <p className="text-2xl sm:text-3xl font-serif font-semibold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => onNavigate('universities')}
              className="btn-primary flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              {t('hero.chooseUni')}
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <a 
              href="/applicants"
              className="btn-outline flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              {t('hero.forApplicants')}
            </a>
            <a 
              href="/statistics"
              className="btn-outline flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              {t('hero.analytics')}
            </a>
            {!user && (
              <a 
                href="/register"
                className="btn-secondary flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {t('hero.register')}
              </a>
            )}
          </div>
        </motion.div>

        {/* Data Source Notice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-muted-foreground"
        >
          {t('hero.dataNotice')}
        </motion.p>
      </div>
    </section>
  );
}
