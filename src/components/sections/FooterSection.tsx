import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { GraduationCap } from 'lucide-react';

const linkColumns = [
  {
    title: 'footer.services',
    links: [
      { label: 'footer.careerQuiz', to: '/career-quiz' },
      { label: 'footer.professionSelection', to: '/profession-selection' },
      { label: 'footer.internships', to: '/internships' },
      { label: 'footer.events', to: '/events' },
      { label: 'footer.careerMap', to: '/career-map' },
    ],
  },
  {
    title: 'footer.dataAnalytics',
    links: [
      { label: 'footer.statistics', to: '/statistics' },
      { label: 'footer.universities', to: '/universities' },
      { label: 'footer.admission', to: '/admission-stats' },
      { label: 'footer.analytics', to: '/analytics/specialties' },
      { label: 'footer.students', to: '/students' },
    ],
  },
  {
    title: 'footer.about',
    links: [
      { label: 'footer.aboutProject', to: '/about' },
      { label: 'footer.blog', to: '/blog' },
      { label: 'footer.team', to: '/team' },
      { label: 'footer.contact', to: '/contact' },
      { label: 'footer.faq', to: '/faq' },
    ],
  },
  {
    title: 'footer.support',
    links: [
      { label: 'footer.helpCenter', to: '/faq' },
      { label: 'footer.privacy', to: '#' },
      { label: 'footer.terms', to: '#' },
    ],
  },
];

export function FooterSection() {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-[#0f1a1c] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section with big GRADPATH branding */}
        <div className="py-16 md:py-20">
          <div className="mb-10">
            <h2 className="text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] font-bold tracking-[0.15em] text-primary/20 select-none leading-none">
              GRADPATH
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mt-12">
            {linkColumns.map((column) => (
              <div key={column.title}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40 mb-5">
                  {t(column.title)}
                </h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="group flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors duration-200"
                      >
                        <span>{t(link.label)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                <GraduationCap className="w-3.5 h-3.5 text-white/60" />
              </div>
              <span className="text-sm text-white/40">
                &copy; {new Date().getFullYear()} GradPath Analytics. {t('footer.allRightsReserved')}
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link to="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">
                {t('footer.terms')}
              </Link>
              <span className="text-xs text-white/20">|</span>
              <span className="text-xs text-white/30">
                {language === 'ru' ? 'Сделано в Беларуси' : language === 'en' ? 'Made in Belarus' : 'Зроблена ў Беларусі'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
