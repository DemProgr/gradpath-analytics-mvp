import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { FooterSection } from '@/components/sections/FooterSection';
import { UniversitiesSection } from '@/components/sections/UniversitiesSection';
import { SpecialtiesComparisonTable } from '@/components/tables/SpecialtiesComparisonTable';
import { SimplePassingScoreCalculator } from '@/components/sections/SimplePassingScoreCalculator';
import { GraduationCap, BookOpen, TrendingUp, Target, BarChart3, ArrowRight, Users } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface ApplicantsProps {
  isChatOpen?: boolean;
  onChatToggle?: (open: boolean) => void;
}

const Applicants = ({ isChatOpen = false }: ApplicantsProps) => {
  const [activeSection, setActiveSection] = useState('overview');
  const navigate = useNavigate();
  const { t } = useLanguage();

  const sectionsRef = {
    overview: useRef<HTMLDivElement>(null),
    universities: useRef<HTMLDivElement>(null),
    calculator: useRef<HTMLDivElement>(null),
    comparison: useRef<HTMLDivElement>(null),
    encouragement: useRef<HTMLDivElement>(null),
  };

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    
    if (section === 'overview') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (section === 'statistics' || section === 'analysis') {
      navigate('/statistics#vacancies');
      return;
    }

    if (section === 'market') {
      if (sectionsRef.universities.current) {
        sectionsRef.universities.current.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    
    const ref = sectionsRef[section as keyof typeof sectionsRef];
    if (ref?.current) {
      const offset = 80;
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && sectionsRef[hash as keyof typeof sectionsRef]) {
      setTimeout(() => {
        handleNavigate(hash);
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header activeSection={activeSection} onSectionChange={setActiveSection} chatOpen={isChatOpen} />
      
      <motion.main
        animate={{
          marginRight: isChatOpen ? '450px' : '0px'
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative"
      >
        <section ref={sectionsRef.overview} id="overview" className="pt-24 pb-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <GraduationCap className="w-5 h-5" />
                <span className="text-sm font-medium">{t('applicants.badge')}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
                {t('applicants.title')}
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                {t('applicants.subtitle')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="card-elevated p-6 text-left">
                  <BookOpen className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">{t('applicants.unis')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('applicants.unisDesc')}
                  </p>
                </div>
                
                <div className="card-elevated p-6 text-left">
                  <TrendingUp className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">{t('applicants.jobMarket')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('applicants.jobMarketDesc')}
                  </p>
                </div>
                
                <div className="card-elevated p-6 text-left">
                  <Target className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">{t('applicants.demand')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('applicants.demandDesc')}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div id="universities" ref={sectionsRef.universities}>
          <UniversitiesSection />
        </div>

        <div id="calculator" ref={sectionsRef.calculator}>
          <SimplePassingScoreCalculator />
        </div>

        <div id="comparison" ref={sectionsRef.comparison}>
          <SpecialtiesComparisonTable />
        </div>

        <div id="encouragement" ref={sectionsRef.encouragement}>
          <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
            <div className="section-container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center max-w-4xl mx-auto"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                  <Target className="w-5 h-5" />
                  <span className="text-sm font-medium">Продолжай путь</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
                  Готов к следующему шагу?
                </h1>
                
                <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
                  Теперь, когда ты знаешь проходные баллы и востребованные профессии, пришло время изучить статистику рынка труда и получить полную картину.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                  <div 
                    className="card-elevated p-6 text-left hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => handleNavigate('statistics')}
                  >
                    <BarChart3 className="w-8 h-8 text-blue-500 mb-4 group-hover:text-blue-600" />
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      Статистика рынка труда
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Анализ вакансий, зарплаты, тренды и прогнозы
                    </p>
                    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      <span>Подробнее</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div 
                    className="card-elevated p-6 text-left hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => handleNavigate('analysis')}
                  >
                    <TrendingUp className="w-8 h-8 text-purple-500 mb-4 group-hover:text-purple-600" />
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      ML анализ
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Прогнозы спроса, рекомендации, умный поиск
                    </p>
                    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      <span>Подробнее</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div 
                    className="card-elevated p-6 text-left hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => handleNavigate('market')}
                  >
                    <Users className="w-8 h-8 text-green-500 mb-4 group-hover:text-green-600" />
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      Рынок труда
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Востребованные профессии, зарплаты, вакансии
                    </p>
                    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      <span>Подробнее</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </motion.main>

      <FooterSection onNavigate={handleNavigate} />
    </div>
  );
};

export default Applicants;
