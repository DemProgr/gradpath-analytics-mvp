import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, GraduationCap, Briefcase, BarChart3, BookOpen, TrendingUp, ClipboardCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { imagePath } from '@/lib/imagePath';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

const cyclingButtons = [
  { href: '/analytics/specialties', icon: BarChart3, label: 'hero.analytics' },
  { href: '/career-map', icon: TrendingUp, label: 'Карьера' },
  { href: '/statistics', icon: BarChart3, label: 'Статистика' },
  { href: '/admission-stats', icon: ClipboardCheck, label: 'Поступление' },
  { href: '/blog', icon: BookOpen, label: 'Блог' },
];

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cyclingButtons.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = cyclingButtons[activeIndex];
  const Icon = current.icon;

  return (
    <section className="relative min-h-[85svh] flex flex-col justify-center overflow-hidden rounded-2xl sm:rounded-[2.25rem]" style={{ background: '#fff' }}>
      <div className="absolute inset-0" style={{ backgroundImage: `url(${imagePath('/Background.avif')})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/40" />
      <div className="relative z-10 w-full pt-16 sm:pt-20 pb-6 sm:pb-10 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight mb-2 sm:mb-4" style={{ fontFamily: "'Organetto Display', 'Organetto', system-ui, sans-serif" }}>
            {t('hero.title')}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <button 
            onClick={() => onNavigate('universities')}
            className="bg-white/20 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-normal hover:bg-white/30 transition-colors flex items-center gap-2 text-sm sm:text-base"
          >
            <GraduationCap className="w-4 h-4" />
            {t('hero.chooseUni')}
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <a
            href="/applicants"
            className="border border-white/40 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-normal hover:bg-white/10 transition-colors flex items-center gap-2 text-sm sm:text-base"
          >
            <Briefcase className="w-4 h-4" />
            {t('hero.forApplicants')}
          </a>

          <div className="relative h-11 sm:h-12 w-[180px] sm:w-[200px]">
            <AnimatePresence mode="popLayout">
              <motion.a
                key={activeIndex}
                href={current.href}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.85 }}
                transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute inset-0 flex items-center justify-center gap-2 border border-white/40 text-white rounded-full font-normal hover:bg-white/10 transition-colors text-sm sm:text-base"
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{t(current.label) || current.label}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </motion.a>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}