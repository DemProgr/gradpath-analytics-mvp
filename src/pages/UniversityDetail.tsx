import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { api } from '@/lib/api/client';
import { ArrowLeft, MapPin, Globe, GraduationCap, Users, TrendingUp, BookOpen, Award, ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';
import { getUniversityByShortName, ALL_UNIVERSITIES } from '@/data/universityMarks';
import { getUniversityFacultiesData, getTotalFacultiesCount, getTotalSpecialtiesCount, Faculty, Specialty, Institute } from '@/data/universityFaculties';
import { useUniversity } from '@/hooks/useUniversities';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/hooks/useLanguage';
import { imagePath } from '@/lib/imagePath';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface University {
  id: string;
  shortName: string;
  fullName: string;
  city: string;
  website: string | null;
  description: string | null;
}

interface AdmissionStat {
  id: string;
  year: number;
  min_score?: number | null;
  avg_score?: number | null;
  budget_places?: number | null;
  paid_places?: number | null;
  paid_min_score?: number | null;
  passing_score_budget?: number | null;
  passing_score_paid?: number | null;
  specialtyId: number | string;
  specialty: { name: string; code: string | null } | null;
}

// University images mapping - проверенные фотографии университетов
const universityImages: Record<string, string> = {
  'БГУ': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Belarus-Minsk-BSU-Rector%27s_Office-2.jpg/1280px-Belarus-Minsk-BSU-Rector%27s_Office-2.jpg',
  'БГУИР': imagePath('/pics/bsuir.jpg'),
  'БНТУ': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Main_building_of_BNTU.jpg/1280px-Main_building_of_BNTU.jpg',
  'БГЭУ': imagePath('/pics/bseu.jpg'),
  'БГМУ': imagePath('/pics/bsmu.jpg'),
  'БГПУ': imagePath('/pics/bspu.jpg'),
  'ГрГУ': imagePath('/pics/uniofgrodno.jpg'),
  'ВГУ': imagePath('/pics/vsu.jpg'),
  'ПГУ': imagePath('/pics/pgu.jpg'),
  'ГГТУ': imagePath('/pics/gstu.jpg'),
  'БГУИЯ': imagePath('/pics/bsufl.jpg'),
  'Академия управления': imagePath('/pics/akademiaupr.jpg'),
  'Академия МВД': imagePath('/pics/akademiamvd.jpg'),
  'БрГУ': imagePath('/pics/brsu.jpg'),
  'БГАА': imagePath('/pics/bsaa.jpg'),
  'БГУКИ': imagePath('/pics/bsuca.jpg'),
  'БГУФК': imagePath('/pics/bsups.jpg'),
};

// Extended descriptions for universities
const universityDescriptions: Record<string, string> = {
  'БГУ': 'Белорусский государственный университет — ведущий классический университет Республики Беларусь, основанный в 1921 году. Входит в топ-500 лучших университетов мира по рейтингу QS. Университет готовит специалистов по 250+ специальностям в области естественных наук, IT, экономики, права и гуманитарных дисциплин. БГУ является крупнейшим научным центром страны с развитой инфраструктурой и международными партнёрствами.',
  'БГУИР': 'Белорусский государственный университет информатики и радиоэлектроники — ведущий технический университет в сфере IT и радиоэлектроники. Основан в 1964 году. Университет готовит высококвалифицированных специалистов для IT-индустрии, телекоммуникаций и высокотехнологичных производств. Выпускники БГУИР востребованы в крупнейших IT-компаниях мира.',
  'БНТУ': 'Белорусский национальный технический университет — крупнейший технический вуз страны, основанный в 1920 году. Готовит инженеров по всем ключевым отраслям: машиностроение, строительство, энергетика, транспорт, IT. Университет имеет современную лабораторную базу и тесные связи с промышленными предприятиями.',
  'БГЭУ': 'Белорусский государственный экономический университет — ведущий экономический вуз страны. Готовит специалистов в области экономики, финансов, маркетинга, менеджмента и международных отношений. Университет активно развивает международное сотрудничество и программы двойных дипломов.',
  'БГМУ': 'Белорусский государственный медицинский университет — главный медицинский вуз страны, основанный в 1921 году. Готовит врачей всех основных специальностей. Университет оснащён современными симуляционными центрами и клиническими базами. Диплом БГМУ признаётся в более чем 50 странах мира.',
  'БГПУ': 'Белорусский государственный педагогический университет имени Максима Танка — ведущий педагогический вуз страны. Готовит учителей, воспитателей, психологов и специалистов в области образования. Университет реализует инновационные образовательные программы и активно внедряет современные педагогические технологии.',
  'ГрГУ': 'Гродненский государственный университет имени Янки Купалы — крупнейший вуз Гродненской области и один из ведущих университетов Беларуси. Готовит специалистов в области естественных наук, гуманитарных дисциплин, экономики и педагогики. Университет активно развивает международное сотрудничество и научные исследования.',
  'ВГУ': 'Витебский государственный университет имени П.М. Машерова — крупнейший вуз Витебской области. Готовит специалистов в области педагогики, гуманитарных наук, техники и технологий. Университет известен своими традициями в подготовке высококвалифицированных кадров для региона.',
  'ПГУ': 'Полоцкий государственный университет имени Евфросинии Полоцкой — современный вуз с богатыми историческими традициями. Готовит специалистов в области инженерии, экономики и педагогики. Университет активно сотрудничает с промышленными предприятиями региона.',
  'ГГТУ': 'Гомельский государственный технический университет имени П.О. Сухого — ведущий технический вуз Гомельской области. Специализируется на подготовке инженерных кадров для машиностроения, электроники и автоматизации. Университет имеет современные лаборатории и учебные центры.',
  'БГУИЯ': 'Минский государственный лингвистический университет (БГУИЯ) — ведущий вуз страны в области лингвистики и межкультурной коммуникации. Готовит высококвалифицированных переводчиков, преподавателей иностранных языков и специалистов в области международных отношений.',
  'Академия управления': 'Академия управления при Президенте Республики Беларусь — ведущий вуз в области государственного управления. Готовит высококвалифицированных управленцев для органов государственной власти и местного самоуправления. Академия известна высокими требованиями к поступающим.',
  'Академия МВД': 'Академия Министерства внутренних дел Республики Беларусь — специализированный вуз для подготовки кадров правоохранительных органов. Готовит офицеров милиции, следователей и специалистов в области юриспруденции и безопасности.',
  'БрГУ': 'Брестский государственный университет имени А.С. Пушкина — крупнейший вуз Брестской области. Готовит специалистов в области педагогики, гуманитарных наук, естественных наук и техники. Университет активно развивает международное сотрудничество с европейскими вузами.',
  'БГАА': 'Белорусская государственная академия авиации — специализированный вуз для подготовки авиационных специалистов. Готовит пилотов, авиационных инженеров, диспетчеров и специалистов по авиационной безопасности. Академия имеет современные авиационные тренажёры.',
  'БГУКИ': 'Белорусский государственный университет культуры и искусств — ведущий вуз в области культуры и искусства. Готовит актёров, режиссёров, музыкантов, хореографов и специалистов по управлению культурой. Университет известен своими творческими коллективами.',
  'БГУФК': 'Белорусский государственный университет физической культуры — специализированный вуз для подготовки специалистов в области физической культуры и спорта. Готовит тренеров, учителей физкультуры, спортивных менеджеров и специалистов по адаптивной физкультуре.',
};

const UniversityDetail = () => {
  const { shortName } = useParams<{ shortName: string }>();
  const decodedShortName = shortName ? decodeURIComponent(shortName) : '';
  const [university, setUniversity] = useState<University | null>(null);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [admissionStats, setAdmissionStats] = useState<AdmissionStat[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedFaculty, setExpandedFaculty] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchUniversity() {
      if (!decodedShortName) return;

      try {
        const universities = await api.get<any[]>('/api/universities');
        const universityData = universities.find(u => u.shortName === decodedShortName);

        if (universityData) {
          setUniversity({
            id: universityData.id,
            shortName: universityData.shortName,
            fullName: universityData.fullName,
            city: universityData.city,
            website: universityData.website || null,
            description: universityData.description || null
          });
        }

        // Always use static data for faculties, institutes, and specialties (authoritative source)
        loadStaticFaculties();
      } catch (error) {
        console.error('Error fetching university from API:', error);
        loadStaticFaculties();
      }

      // Always load admission stats from static data (most complete source)
      // Merges with API data if available
      await loadStaticAdmissionStats();

      setLoading(false);
    }

    async function loadStaticFaculties() {
      const staticData = getUniversityFacultiesData(decodedShortName);
      const staticUniversity = getUniversityByShortName(decodedShortName);

      if (staticData) {
        setFaculties(staticData.faculties as Faculty[]);
        setInstitutes((staticData.institutes || []) as Institute[]);
        setSpecialties(staticData.specialties);
      }

      if (staticUniversity) {
        setUniversity({
          id: staticUniversity.id,
          shortName: staticUniversity.short_name,
          fullName: staticUniversity.full_name,
          city: staticUniversity.city,
          website: staticUniversity.website || null,
          description: null
        });
      }
    }

    async function loadStaticAdmissionStats() {
      const staticData = getUniversityFacultiesData(decodedShortName);

      if (!staticData || staticData.specialties.length === 0) return;

      const specialtyIds = staticData.specialties.map(s => s.id);
      
      let allStats: any[] = [];
      try {
        allStats = await api.get<any[]>('/api/admission-stats');
      } catch {
        // API not available, use only static data
      }

      const apiData = allStats.filter(s => specialtyIds.includes(s.specialtyId));
      apiData.sort((a, b) => (b.year || 0) - (a.year || 0));

      const staticSpecialtyMap = new Map(staticData.specialties.map(s => [s.id, s]));

      const staticStats = staticData.specialties
        .flatMap(s => {
          if (s.passing_scores && s.passing_scores.length > 0) {
            return s.passing_scores.map(ps => ({
              id: `${s.id}-${ps.year}`,
              specialtyId: s.id,
              year: ps.year,
              min_score: ps.budget,
              passing_score_budget: ps.budget,
              passing_score_paid: ps.paid,
              specialty: {
                name: s.name,
                code: s.code,
                faculty_id: s.faculty_id,
                institute_id: s.institute_id
              }
            }));
          }
          if (s.passing_score_budget && s.year) {
            return [{
              id: `${s.id}-${s.year}`,
              specialtyId: s.id,
              year: s.year,
              min_score: s.passing_score_budget,
              passing_score_budget: s.passing_score_budget,
              specialty: {
                name: s.name,
                code: s.code,
                faculty_id: s.faculty_id,
                institute_id: s.institute_id
              }
            }];
          }
          return [];
        });

      let mergedStats: any[] = [];

      if (apiData.length > 0) {
        const apiStats = apiData.map(stat => {
          const staticSpecialty = staticSpecialtyMap.get(stat.specialtyId);
          return {
            ...stat,
            specialty: staticSpecialty ? { 
              name: staticSpecialty.name, 
              code: staticSpecialty.code,
              faculty_id: staticSpecialty.faculty_id,
              institute_id: staticSpecialty.institute_id
            } : null
          };
        });
        mergedStats = apiStats;
      }

      const existingKeys = new Set(mergedStats.map(s => `${s.specialtyId}-${s.year}`));
      staticStats.forEach(stat => {
        const key = `${stat.specialtyId}-${stat.year}`;
        if (existingKeys.has(key)) {
          const existing = mergedStats.find(s => `${s.specialtyId}-${s.year}` === key);
          const hasActualScores = existing && (
            (existing.min_score || existing.passing_score_budget) ||
            (existing.paid_min_score || existing.passing_score_paid)
          );
          if (!hasActualScores) {
            const idx = mergedStats.findIndex(s => `${s.specialtyId}-${s.year}` === key);
            if (idx !== -1) mergedStats[idx] = stat;
          }
        } else {
          mergedStats.push(stat);
        }
      });

      mergedStats.sort((a, b) => (b.year || 0) - (a.year || 0));
      setAdmissionStats(mergedStats);
    }

    fetchUniversity();
  }, [decodedShortName]);

  const heroImage = university ? universityImages[university.shortName] || universityImages['БГУ'] : '';
  const extendedDescription = university ? universityDescriptions[university.shortName] : '';

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="pt-24 pb-16">
          <div className="section-container">
            <Skeleton className="h-12 w-64 mb-4" />
            <Skeleton className="h-6 w-96 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="min-h-screen bg-background">
        <Header activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="pt-24 pb-16">
          <div className="section-container text-center">
            <h1 className="text-3xl font-display font-bold text-foreground mb-4">
              {t('uni.notFound')}
            </h1>
            <p className="text-muted-foreground mb-8">
              {t('uni.notFoundDesc')}
            </p>
            <Link to="/applicants">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('uni.backToList')}
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="pt-20 pb-16">
        {/* Hero Image */}
        <div className="relative w-full h-[250px] md:h-[350px] overflow-hidden bg-gray-200">
          <img 
            src={heroImage} 
            alt={university.fullName}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              // Fallback to local image or placeholder if external image fails
              const target = e.target as HTMLImageElement;
              target.src = imagePath('/pics/placeholder-university.jpg');
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="section-container">
              <Link 
                to="/applicants" 
                className="inline-flex items-center gap-2 text-green-900 hover:text-green-700 transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('uni.backToList')}
              </Link>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-green-900 mb-2">
                {university.shortName}
              </h1>
              <p className="text-lg md:text-xl text-green-900">
                {university.fullName}
              </p>
            </div>
          </div>
        </div>

        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground">
                <MapPin className="w-4 h-4" />
                <span>{university.city}</span>
              </div>
              
              {university.website && (
                <a 
                  href={university.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>{t('uni.website')}</span>
                </a>
              )}

              {admissionStats.length > 0 && (
                <a 
                  href="#admission-stats" 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>{t('uni.scores')}</span>
                </a>
              )}
              
<Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => document.getElementById('faculties')?.scrollIntoView({ behavior: 'smooth' })}>
                <GraduationCap className="w-4 h-4 mr-2" />
                <Link to="#faculties" className="hover:underline">{faculties.length} {t('uni.faculties')}</Link>
              </Badge>
              
              {institutes.length > 0 && (
              <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => document.getElementById('institutes')?.scrollIntoView({ behavior: 'smooth' })}>
                <GraduationCap className="w-4 h-4 mr-2" />
                <Link to="#institutes" className="hover:underline">{institutes.length} учреждений образования</Link>
              </Badge>
              )}
              
              {specialties.length > 0 && (
                <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => document.getElementById('faculties')?.scrollIntoView({ behavior: 'smooth' })}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  <Link to="#faculties" className="hover:underline">{specialties.length} {t('uni.specialties')}</Link>
                </Badge>
              )}
            </div>

            {/* Description */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{t('uni.about')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {extendedDescription || university.description || t('common.loading')}
                </p>
              </CardContent>
            </Card>

            {/* Faculties */}
            {faculties.length > 0 && (
              <Card className="mb-8" id="faculties">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Факультеты ({faculties.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {faculties.map(faculty => {
                      const facultySpecialties = specialties.filter(s => s.faculty_id === faculty.id || s.faculty_name === faculty.name);
                      const isExpanded = expandedFaculty === faculty.id;
                      
                      return (
                        <div 
                          key={faculty.id} 
                          className="border rounded-lg overflow-hidden"
                        >
                          <button
                            onClick={() => setExpandedFaculty(isExpanded ? null : faculty.id)}
                            className="w-full p-4 flex items-center justify-between bg-muted/50 hover:bg-muted transition-colors text-left"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-primary" />
                                <h4 className="font-medium text-foreground">{faculty.name}</h4>
                                {faculty.code && (
                                  <span className="text-xs text-muted-foreground">({faculty.code})</span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {faculty.id === 'bsuir-9' ? 'Подготовка к ЦТ/ЦЭ' : `${facultySpecialties.length} специальностей`}
                              </p>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-4" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-4" />
                            )}
                          </button>
                          
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-t bg-background"
                            >
                              <div className="p-4">
                                {faculty.id === 'bsuir-9' ? (
                                  <div className="text-sm text-muted-foreground">
                                    <p className="mb-2">Факультет доуниверситетской подготовки и профессиональной ориентации (ФДПиПО) занимается подготовкой абитуриентов к вступительным экзаменам (ЦТ/ЦЭ) для поступления в вуз.</p>
                                    <p>На факультете не предусмотрено получение высшего образования по специальностям.</p>
                                  </div>
                                ) : (
                                  <>
                                    <h5 className="text-sm font-medium text-muted-foreground mb-3">
                                      Специальности:
                                    </h5>
                                    <ul className="space-y-2">
                                      {facultySpecialties.map(specialty => (
                                        <li 
                                          key={specialty.id}
                                          className="flex items-start gap-3 p-2 rounded hover:bg-muted/50 transition-colors"
                                        >
                                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                          <div className="flex-1">
                                            <span className="text-foreground">{specialty.name}</span>
                                            {specialty.code && (
                                              <span className="text-xs text-muted-foreground ml-2">
                                                ({specialty.code})
                                              </span>
                                            )}
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  </>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Institutes / Учреждения образования */}
            {institutes.length > 0 && (
              <Card className="mb-8" id="institutes">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Учреждения образования ({institutes.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {institutes.map(institute => {
                      const instituteSpecialties = specialties.filter(s => s.institute_id === institute.id || s.faculty_name === institute.name);
                      const isExpanded = expandedFaculty === institute.id;
                      
                      return (
                        <div 
                          key={institute.id} 
                          className="border rounded-lg overflow-hidden border-primary/30"
                        >
                          <button
                            onClick={() => setExpandedFaculty(isExpanded ? null : institute.id)}
                            className="w-full p-4 flex items-center justify-between bg-primary/10 hover:bg-primary/15 transition-colors text-left"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-primary" />
                                <h4 className="font-medium text-foreground">{institute.name}</h4>
                                {institute.code && (
                                  <span className="text-xs text-muted-foreground">({institute.code})</span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {institute.id === 'bspu-i3' ? 'Повышение квалификации' :
                                 instituteSpecialties.length > 0 ? `${instituteSpecialties.length} специальностей` :
                                 'программ ВО нет'}
                              </p>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-4" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-4" />
                            )}
                          </button>
                          
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-t bg-background"
                            >
                              <div className="p-4">
                                {institute.id === 'bspu-i3' ? (
                                  <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                      Институт повышения квалификации и переподготовки кадров БГПУ создан для{' '}
                                      <strong>руководителей и специалистов учреждений образования</strong>, желающих повысить свою квалификацию или получить новую специальность в области педагогики и образования.
                                    </p>
                                    <a 
                                      href="https://ipkip.bspu.by/" 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                                    >
                                      <Globe className="w-4 h-4" />
                                      Перейти на сайт института →
                                    </a>
                                  </div>
                                ) : instituteSpecialties.length > 0 ? (
                                  <>
                                    <h5 className="text-sm font-medium text-muted-foreground mb-3">
                                      Специальности:
                                    </h5>
                                    <ul className="space-y-2">
                                      {instituteSpecialties.map(specialty => (
                                        <li 
                                          key={specialty.id}
                                          className="flex items-start gap-3 p-2 rounded hover:bg-muted/50 transition-colors"
                                        >
                                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                          <div className="flex-1">
                                            <span className="text-foreground">{specialty.name}</span>
                                            {specialty.code && (
                                              <span className="text-xs text-muted-foreground ml-2">
                                                ({specialty.code})
                                              </span>
                                            )}
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  </>
                                ) : (
                                  <div className="p-4">
                                    <p className="text-sm text-muted-foreground">
                                      Учреждение не ведет подготовку по программам общего высшего образования.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Specialties without faculties */}
            {faculties.length === 0 && specialties.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Специальности ({specialties.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {specialties.map(specialty => (
                      <li 
                        key={specialty.id}
                        className="flex items-start gap-3 p-2 rounded hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <span className="text-foreground">{specialty.name}</span>
                          {specialty.code && (
                            <span className="text-xs text-muted-foreground ml-2">
                              ({specialty.code})
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Admission Stats */}
            {admissionStats.length > 0 && (faculties.length > 0 || institutes.length > 0) && (
              <Card className="mb-8" id="admission-stats">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Проходные баллы {university?.shortName || decodedShortName} 2025
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="font-medium">Мин. балл</span> — минимальный балл для поступления; 
                    <span className="font-medium ml-3">Ср. балл</span> — средний балл зачисленных студентов.
                    Данные только для бюджетных мест.
                  </p>
                </CardHeader>
                <CardContent>
                  {/* Filters as Select */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="w-[180px]">
                      <Select value={selectedYear?.toString() || "all"} onValueChange={(v) => { setSelectedYear(v === "all" ? null : parseInt(v)); setHasInteracted(true); }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Год" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Все годы</SelectItem>
                          {[2025, 2024, 2023, 2022].map(year => (
                            <SelectItem key={year} value={year.toString()}>{year} {year === 2025 ? '(актуально)' : ''}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-[280px]">
                      <Select value={selectedFaculty || "all"} onValueChange={(v) => { setSelectedFaculty(v === "all" ? null : v); setSelectedSpecialty(null); setHasInteracted(true); }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Факультет / Институт" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Все факультеты и институты</SelectItem>
                          {faculties.length > 0 && (
                            <>
                              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Факультеты</div>
                              {faculties.map(faculty => (
                                <SelectItem key={faculty.id} value={faculty.id}>{faculty.code || faculty.name}</SelectItem>
                              ))}
                            </>
                          )}
                          {institutes.filter(i => specialties.some(s => s.institute_id === i.id)).length > 0 && (
                            <>
                              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-1">Институты</div>
                              {institutes.filter(i => specialties.some(s => s.institute_id === i.id)).map(institute => (
                                <SelectItem key={institute.id} value={institute.id}>{institute.code || institute.name}</SelectItem>
                              ))}
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedFaculty && (
                      <div className="w-[320px]">
                        <Select value={selectedSpecialty || "all"} onValueChange={(v) => { setSelectedSpecialty(v === "all" ? null : v); setHasInteracted(true); }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Специальность" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Все специальности</SelectItem>
                            {specialties
                              .filter(s => {
                                if (!selectedFaculty) return true;
                                // Filter by faculty_id or institute_id
                                return s.faculty_id === selectedFaculty || s.institute_id === selectedFaculty;
                              })
                              .map(specialty => (
                                <SelectItem key={specialty.id} value={specialty.id}>
                                  {specialty.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Selected faculty/specialty info */}
                  {(selectedFaculty || selectedSpecialty) && (
                    <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      {selectedFaculty && !selectedSpecialty && (
                        <div>
                          <span className="text-xs text-muted-foreground">Выбран: </span>
                          <span className="font-medium text-foreground">
                            {faculties.find(f => f.id === selectedFaculty)?.name || institutes.find(i => i.id === selectedFaculty)?.name}
                          </span>
                        </div>
                      )}
                      {selectedSpecialty && (
                        <div>
                          <span className="text-xs text-muted-foreground">Выбрана специальность: </span>
                          <span className="font-medium text-foreground">
                            {specialties.find(s => s.id === selectedSpecialty)?.name}
                          </span>
                          <div className="text-xs text-muted-foreground mt-1">
                            {(() => {
                              const spec = specialties.find(s => s.id === selectedSpecialty);
                              const fac = faculties.find(f => f.id === spec?.faculty_id);
                              const inst = institutes.find(i => i.id === spec?.institute_id);
                              return fac ? `Факультет: ${fac.name}` : inst ? `Институт: ${inst.name}` : '';
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Chart */}
                  {(() => {
                    const filteredStats = admissionStats.filter(stat => {
if (selectedYear && stat.year !== selectedYear) return false;
                            
                            // Handle specialty filter - match by string comparison
                            if (selectedSpecialty) {
                              const statSpecialtyId = stat.specialtyId ? String(stat.specialtyId) : null;
                              const matches = statSpecialtyId === selectedSpecialty || stat.specialtyId === Number(selectedSpecialty);
                              if (!matches) return false;
                            }
                      
                      if (selectedFaculty) {
                        const statFacultyId = String((stat.specialty as any)?.faculty_id || 
                                              (stat.specialty as any)?.institute_id ||
                                              stat.specialtyId);
                        const staticSpecialty = specialties.find(s => String(s.id) === String(stat.specialtyId));
                        const staticFacultyId = staticSpecialty?.faculty_id || staticSpecialty?.institute_id;
                        if (statFacultyId !== selectedFaculty && staticFacultyId !== selectedFaculty) return false;
                      }
                      return true;
                    });

                    let chartData: { year: number; min: number | null; avg: number | null; paid: number | null }[] = [];
                    
                    if (selectedSpecialty) {
                      chartData = filteredStats
                        .sort((a, b) => a.year - b.year)
                        .map(s => ({ 
                          year: s.year, 
                          min: (s.min_score || s.passing_score_budget) ? Number(s.min_score || s.passing_score_budget) : null, 
                          avg: s.avg_score ? Number(s.avg_score) : null,
                          paid: (s.paid_min_score || s.passing_score_paid) ? Number(s.paid_min_score || s.passing_score_paid) : null
                        }));
                    } else if (filteredStats.length > 0) {
                      const grouped = filteredStats.reduce((acc, stat) => {
                        const key = stat.year;
                        if (!acc[key]) acc[key] = { year: stat.year, minSum: 0, avgSum: 0, paidSum: 0, minCount: 0, avgCount: 0, paidCount: 0 };
                        if (stat.min_score || stat.passing_score_budget) { acc[key].minSum += Number(stat.min_score || stat.passing_score_budget); acc[key].minCount += 1; }
                        if (stat.avg_score) { acc[key].avgSum += Number(stat.avg_score); acc[key].avgCount += 1; }
                        if (stat.paid_min_score || stat.passing_score_paid) { acc[key].paidSum += Number(stat.paid_min_score || stat.passing_score_paid); acc[key].paidCount += 1; }
                        return acc;
                      }, {} as Record<number, { year: number; minSum: number; avgSum: number; paidSum: number; minCount: number; avgCount: number; paidCount: number }>);
                      
                      chartData = Object.values(grouped)
                        .map(v => ({ 
                          year: v.year, 
                          min: v.minCount > 0 ? Math.round(v.minSum / v.minCount) : null, 
                          avg: v.avgCount > 0 ? Math.round(v.avgSum / v.avgCount) : null,
                          paid: v.paidCount > 0 ? Math.round(v.paidSum / v.paidCount) : null
                        }))
                        .sort((a, b) => a.year - b.year);
                    }

                    const getSelectionTitle = () => {
                      if (selectedSpecialty) {
                        const spec = specialties.find(s => s.id === selectedSpecialty);
                        return spec?.name || '';
                      }
                      if (selectedFaculty) {
                        const fac = faculties.find(f => f.id === selectedFaculty);
                        const inst = institutes.find(i => i.id === selectedFaculty);
                        return fac?.name || inst?.name || '';
                      }
                      return '';
                    };

                    const hasAnyData = chartData.some(d => d.min || d.avg || d.paid);
                    
                    if (chartData.length > 1 && hasAnyData) {
                      const selectionTitle = getSelectionTitle();
                      return (
                        <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                          <h4 className="text-sm font-medium mb-4">
                            Динамика проходных баллов{selectionTitle ? ` (${selectionTitle})` : ''}
                          </h4>
                          <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                              <YAxis domain={['dataMin - 20', 'dataMax + 20']} tick={{ fontSize: 12 }} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                                formatter={(value: number) => value ? [value, ''] : ['—', '']}
                              />
                              <Legend />
                              <Line type="monotone" dataKey="min" name="Мин. (бюджет)" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                              <Line type="monotone" dataKey="avg" name="Ср. (бюджет)" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                              <Line type="monotone" dataKey="paid" name="Платное" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      );
                    }
                    return null;
                  })()}
                  
                  <div className="max-h-[500px] overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                        <TableRow>
                          <TableHead>Специальность</TableHead>
                          <TableHead className="text-center">Год</TableHead>
                          <TableHead className="text-right">Бюджет</TableHead>
                          <TableHead className="text-right">Платное</TableHead>
                          <TableHead className="text-right">Ср. балл</TableHead>
                          <TableHead className="text-right">Мест (бюдж/платн)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {admissionStats.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              Нет данных о проходных баллах
                            </TableCell>
                          </TableRow>
                        ) : !hasInteracted ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              Выберите год, факультет или специальность для отображения проходных баллов
                            </TableCell>
                          </TableRow>
                        ) : admissionStats
                          .filter(stat => {
                            if (selectedYear && stat.year !== selectedYear) return false;
                            
                            // Handle specialty filter - match by string comparison
                            if (selectedSpecialty) {
                              const statSpecialtyId = stat.specialtyId ? String(stat.specialtyId) : null;
                              const matches = statSpecialtyId === selectedSpecialty || stat.specialtyId === Number(selectedSpecialty);
                              if (!matches) return false;
                            }
                            
                            if (selectedFaculty) {
                              const statFacultyId = String((stat.specialty as any)?.faculty_id || 
                                                    (stat.specialty as any)?.institute_id ||
                                                    stat.specialtyId);
                              const staticSpecialty = specialties.find(s => String(s.id) === String(stat.specialtyId));
                              const staticFacultyId = staticSpecialty?.faculty_id || staticSpecialty?.institute_id;
                              if (statFacultyId !== selectedFaculty && staticFacultyId !== selectedFaculty) return false;
                            }
                            return true;
                          })
                          .reduce((acc, stat) => {
                            if (!acc.some(s => s.specialtyId === stat.specialtyId && s.year === stat.year)) {
                              acc.push(stat);
                            }
                            return acc;
                          }, [] as typeof admissionStats)
                          .map((stat, index) => (
                          <TableRow key={`${stat.id}-${index}`}>
                            <TableCell className="font-medium">
                              {stat.specialty?.name || 'Н/Д'}
                              {stat.specialty?.code && (
                                <span className="text-xs text-muted-foreground ml-2">
                                  ({stat.specialty.code})
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline">{stat.year}</Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium text-green-700">
                              {stat.min_score || stat.passing_score_budget ? Number(stat.min_score || stat.passing_score_budget).toFixed(0) : '—'}
                            </TableCell>
                            <TableCell className="text-right font-medium text-blue-700">
                              {stat.paid_min_score || stat.passing_score_paid ? Number(stat.paid_min_score || stat.passing_score_paid).toFixed(0) : '—'}
                            </TableCell>
                            <TableCell className="text-right">
                              {stat.avg_score ? Number(stat.avg_score).toFixed(0) : '—'}
                            </TableCell>
                            <TableCell className="text-right">{stat.budget_places || '—'}/{stat.paid_places || '—'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No data notice */}
            {faculties.length === 0 && (
              <Card className="bg-muted/50">
                <CardContent className="py-8 text-center">
                  <GraduationCap className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Данные загружаются</h3>
                  <p className="text-muted-foreground">
                    Детальная информация о факультетах и специальностях будет добавлена после парсинга данных.
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default UniversityDetail;
