import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/sections/HeroSection';
import { FooterSection } from '@/components/sections/FooterSection';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, GraduationCap, Users, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { BelarusMap } from '@/components/BelarusMap';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";

interface IndexProps {
  isChatOpen?: boolean;
  onChatToggle?: (open: boolean) => void;
}

const Index = ({ isChatOpen = false }: IndexProps) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselApiRef = useRef<any>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const sectionsRef = {
    overview: useRef<HTMLDivElement>(null),
    universities: useRef<HTMLDivElement>(null),
  };

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    
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
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      Object.entries(sectionsRef).forEach(([key, ref]) => {
        if (ref.current) {
          const { offsetTop, offsetHeight } = ref.current;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(key);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselApiRef.current) {
        const nextSlide = (currentSlide + 1) % 3;
        carouselApiRef.current.scrollTo(nextSlide);
        setCurrentSlide(nextSlide);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const quickLinks = [
    {
      title: t('quickLinks.forApplicants'),
      description: t('quickLinks.forApplicantsDesc'),
      icon: GraduationCap,
      path: '/applicants#specialties',
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: t('quickLinks.forStudents'),
      description: t('quickLinks.forStudentsDesc'),
      icon: Users,
      path: '/students#market',
      color: 'bg-green-500/10 text-green-600',
    },
    {
      title: t('quickLinks.statistics'),
      description: t('quickLinks.statisticsDesc'),
      icon: BarChart3,
      path: '/statistics#vacancies',
      color: 'bg-purple-500/10 text-purple-600',
    },
    {
      title: t('quickLinks.admission'),
      description: t('quickLinks.admissionDesc'),
      icon: TrendingUp,
      path: '/admission-stats',
      color: 'bg-orange-500/10 text-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header activeSection={activeSection} onSectionChange={handleNavigate} chatOpen={isChatOpen} />
      
      <motion.main
        animate={{
          marginRight: isChatOpen ? '450px' : '0px'
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative"
      >
        {/* Hero / Overview */}
        <div ref={sectionsRef.overview}>
          <HeroSection onNavigate={handleNavigate} />
        </div>

{/* Hero Slider */}
          <Carousel 
            className="w-full relative" 
            opts={{ loop: true }}
            setApi={(api) => { 
              carouselApiRef.current = api;
              api?.on('select', () => {
                setCurrentSlide(api.selectedScrollSnap());
              });
            }}
          >
            <CarouselContent>
              <CarouselItem className="w-full">
                <div className="relative h-[400px] sm:h-[500px] flex items-center" style={{ backgroundColor: 'rgb(232, 165, 149)' }}>
                  <div className="flex items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex-1 text-blue-950 pr-8">
                      <p className="text-base uppercase tracking-wider mb-2 opacity-80">Услуги</p>
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Times New Roman, serif' }}>Мир услуг для тех, кто учится, и для тех, кто заканчивает обучение</h2>
                      <p className="text-lg sm:text-xl mb-6 opacity-90" style={{ fontFamily: 'Times New Roman, serif' }}>Ориентация, обучение, рынок труда и руководство по образованию в Беларуси: все услуги, доступные для абитуриентов, студентов и выпускников.</p>
                      <a href="/applicants" className="inline-flex group">
                        <span className="px-6 py-3 font-medium transition-colors hover:bg-amber-500 bg-red-700 text-white rounded-l-lg">
                          Узнать больше
                        </span>
                        <span className="px-3 flex items-center justify-center transition-colors hover:bg-amber-500 bg-amber-500 rounded-r-lg">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </a>
                    </div>
                    <div className="hidden sm:block flex-shrink-0">
                      <img 
                        src="/design.png" 
                        alt="Студенты" 
                        className="h-[400px] sm:h-[500px] w-auto object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem className="w-full">
                <div className="relative h-[400px] sm:h-[500px] flex items-center" style={{ backgroundColor: 'rgb(237, 207, 130)' }}>
                  <div className="flex items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex-1 text-blue-950 pr-8">
                      <p className="text-base uppercase tracking-wider mb-2 opacity-80">Данные</p>
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Times New Roman, serif' }}>Актуальные и надёжные данные</h2>
                      <p className="text-lg sm:text-xl mb-6 opacity-90" style={{ fontFamily: 'Times New Roman, serif' }}>Данные о проходных баллах и специальностях с 2020 года. Простота в использовании данных. Надёжность и качественность.</p>
                      <a href="/statistics" className="inline-flex group">
                        <span className="px-6 py-3 font-medium transition-colors hover:bg-amber-500 bg-red-700 text-white rounded-l-lg">
                          Узнать больше
                        </span>
                        <span className="px-3 flex items-center justify-center transition-colors hover:bg-amber-500 bg-amber-500 rounded-r-lg">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </a>
                    </div>
                    <div className="hidden sm:block flex-shrink-0">
                      <img 
                        src="/bntu.png" 
                        alt="Данные" 
                        className="h-[400px] sm:h-[500px] w-auto object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem className="w-full">
                <div className="relative h-[400px] sm:h-[500px] flex items-center" style={{ backgroundColor: 'rgb(130, 180, 237)' }}>
                  <div className="flex items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex-1 text-blue-950 pr-8">
                      <p className="text-base uppercase tracking-wider mb-2 opacity-80">Анкета</p>
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Times New Roman, serif' }}>Пройдите анкету</h2>
                      <p className="text-lg sm:text-xl mb-6 opacity-90" style={{ fontFamily: 'Times New Roman, serif' }}>Ваше мнение важно: примите участие в масштабном опросе об университетах и работе в Беларуси.</p>
                      <a href="#" className="inline-flex group">
                        <span className="px-6 py-3 font-medium transition-colors hover:bg-amber-500 bg-red-700 text-white rounded-l-lg">
                          Заполните анкету
                        </span>
                        <span className="px-3 flex items-center justify-center transition-colors hover:bg-amber-500 bg-amber-500 rounded-r-lg">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </a>
                    </div>
                    <div className="hidden sm:block flex-shrink-0">
                      <img 
                        src="/bntu2.png" 
                        alt="Анкета" 
                        className="h-[400px] sm:h-[500px] w-auto object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </CarouselItem>
              
            </CarouselContent>
            <div className="absolute bottom-6 left-12 sm:left-24 flex gap-2">
              {['У', 'Д', 'А'].map((letter, index) => (
                <button 
                  key={index}
                  style={{ fontFamily: 'Times New Roman, serif' }}
                  className={`w-16 h-2 rounded-full transition-colors ${currentSlide === index ? 'bg-white/80' : 'bg-white/30 hover:bg-amber-500'}`}
                  onClick={() => carouselApiRef.current?.scrollTo(index)}
                  aria-label={`Slide ${letter}`}
                />
              ))}
            </div>
          </Carousel>

          <section className="py-12 section-container">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="relative group">
                <img 
                  src="/grodnoimage2.png" 
                  alt="Путь" 
                  className="w-full h-[450px] sm:h-[550px] object-cover rounded-lg transition-all duration-300 group-hover:blur-sm"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-blue-950/90 px-12 py-8 rounded-lg text-center max-w-md min-h-[350px] flex flex-col justify-center">
                    <h3 className="text-white text-2xl sm:text-3xl font-medium mb-3">Выбираете направление обучения?</h3>
                    <p className="text-white/90 text-base mb-6">GradPath поможет вам принять самые важные решения: вся необходимая информация, чтобы найти правильный для вас путь.</p>
                    <a href="/applicants" className="inline-flex group">
                      <span className="px-4 py-2 font-medium transition-colors hover:bg-amber-500 bg-red-700 text-white rounded-l-lg">
                        Узнайте, как
                      </span>
                      <span className="px-2 flex items-center justify-center transition-colors hover:bg-amber-500 bg-amber-500 rounded-r-lg">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <img 
                  src="/design.png" 
                  alt="Анкета" 
                  className="w-full h-[450px] sm:h-[550px] object-cover rounded-lg transition-all duration-300 group-hover:blur-sm"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-blue-950/90 px-12 py-8 rounded-lg text-center max-w-md min-h-[350px] flex flex-col justify-center">
                    <h3 className="text-white text-2xl sm:text-3xl font-medium mb-3">Анкета по окончании курса</h3>
                    <p className="text-white/90 text-base mb-6">Выскажите своё мнение о выбранном вами образовательном пути.</p>
                    <a href="#" className="inline-flex group">
                      <span className="px-4 py-2 font-medium transition-colors hover:bg-amber-500 bg-red-700 text-white rounded-l-lg">
                        Заполните анкету
                      </span>
                      <span className="px-2 flex items-center justify-center transition-colors hover:bg-amber-500 bg-amber-500 rounded-r-lg">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                    Белорусские университеты и <span className="font-normal">GradPath</span>
                  </h2>
                  <div className="w-full h-px bg-gray-300 my-8"></div>
                  <p className="text-lg sm:text-xl text-muted-foreground mb-8">
                    Выбор университета - очень важный этап. Изучите возможности, доступные в каждом университете: программы обучения, условия для студентов, возможные направления развития.
                  </p>
                  <a href="/universities" className="inline-flex items-center gap-2 text-lg sm:text-xl font-medium hover:text-amber-500 transition-colors">
                    Найдите подходящий именно вам
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
                <div className="hidden lg:block relative">
                  <BelarusMap />
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'rgb(228, 235, 242)' }}>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Вам нужна дополнительная информация или поддержка? Мы к вашим услугам!
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8">
                Свяжитесь с нами, чтобы получить информацию, предложение о сотрудничестве, мы ответим вам в кратчайшие сроки
              </p>
              <a href="/contact" className="inline-flex group">
                <span className="px-4 py-2 font-medium transition-colors hover:bg-amber-500 bg-red-700 text-white rounded-l-lg">
                  Связаться с нами
                </span>
                <span className="px-2 flex items-center justify-center transition-colors hover:bg-amber-500 bg-amber-500 rounded-r-lg">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </a>
              <div className="w-full h-px bg-gray-400 mt-12"></div>
            </div>
          </section>

{/* Universities */}
      </motion.main>

      <FooterSection onNavigate={handleNavigate} />
    </div>
  );
};

export default Index;
