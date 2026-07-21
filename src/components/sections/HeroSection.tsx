import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, GraduationCap, Briefcase, BarChart3, Search, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useUniversities } from '@/hooks/useUniversities';
import { imagePath } from '@/lib/imagePath';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { universities } = useUniversities();

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
    <section className="relative min-h-[85svh] flex flex-col justify-center overflow-hidden rounded-2xl sm:rounded-[2.25rem]" style={{ background: '#fff' }}>
      <div className="absolute inset-0" style={{ backgroundImage: `url(${imagePath('/Background.avif')})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/40" />
      <div className="relative z-10 w-full pt-16 sm:pt-20 pb-6 sm:pb-10 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-4 sm:mb-8"
        >
          <h1 className="font-['Organetto'] text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight mb-2 sm:mb-4">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <button 
            onClick={() => onNavigate('universities')}
            className="bg-white/20 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium hover:bg-white/30 transition-colors flex items-center gap-2 text-sm sm:text-base">
            <GraduationCap className="w-4 h-4" />
            {t('hero.chooseUni')}
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <a 
            href="/applicants"
            className="border border-white/40 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium hover:bg-white/10 transition-colors flex items-center gap-2 text-sm sm:text-base">
            <Briefcase className="w-4 h-4" />
            {t('hero.forApplicants')}
          </a>
          <a 
            href="/statistics"
            className="border border-white/40 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium hover:bg-white/10 transition-colors flex items-center gap-2 text-sm sm:text-base">
            <BarChart3 className="w-4 h-4" />
            {t('hero.analytics')}
          </a>
          {!user && (
            <a 
              href="/register"
              className="bg-white text-[#1a284a] px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium hover:bg-white/90 transition-colors flex items-center gap-2 text-sm sm:text-base">
              <Sparkles className="w-4 h-4" />
              {t('hero.register')}
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}