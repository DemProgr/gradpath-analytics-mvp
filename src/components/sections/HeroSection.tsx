import { motion } from 'framer-motion';
import { ArrowUpRight, GraduationCap, Briefcase, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { imagePath } from '@/lib/imagePath';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[85svh] flex flex-col justify-center overflow-hidden rounded-2xl sm:rounded-[2.25rem]" style={{ background: '#fff' }}>
      <div className="absolute inset-0" style={{ backgroundImage: `url(${imagePath('/Background.avif')})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/40" />
      <div className="relative z-10 w-full pt-16 sm:pt-20 pb-6 sm:pb-10 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-4 sm:mb-8"
        >
          <h1 className="font-['Organetto'] text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight mb-2 sm:mb-4">
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
            className="bg-white/20 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-normal hover:bg-white/30 transition-colors flex items-center gap-2 text-sm sm:text-base font-['Organetto']">
            <GraduationCap className="w-4 h-4" />
            {t('hero.chooseUni')}
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <a 
            href="/applicants"
            className="border border-white/40 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-normal hover:bg-white/10 transition-colors flex items-center gap-2 text-sm sm:text-base font-['Organetto']">
            <Briefcase className="w-4 h-4" />
            {t('hero.forApplicants')}
          </a>
          <a 
            href="/statistics"
            className="border border-white/40 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-normal hover:bg-white/10 transition-colors flex items-center gap-2 text-sm sm:text-base font-['Organetto']">
            <BarChart3 className="w-4 h-4" />
            {t('hero.analytics')}
          </a>

        </motion.div>
      </div>
    </section>
  );
}