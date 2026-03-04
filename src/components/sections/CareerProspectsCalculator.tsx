import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, TrendingDown, MapPin, Calendar, AlertTriangle, Users, GraduationCap, Building, BarChart3, Target, Award, BookOpen, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface CareerData {
  employmentRate: number;
  growthRate: number;
  competition: 'very_high' | 'low' | 'medium' | 'high';
  careerStability: number;
  skillsDemand: Record<string, number>;
  similarProfessions: string[];
  requiredEducation: string;
  growthProspects: { years: number; position: string }[];
  salaryLevel: 'very_high' | 'high' | 'medium' | 'low';
  salaryRange: { min: number; max: number; median: number };
}

const careerDatabase: Record<string, CareerData> = {
  it: {
    employmentRate: 92,
    growthRate: 15,
    competition: 'high',
    careerStability: 85,
    salaryLevel: 'very_high',
    salaryRange: { min: 1000, max: 3500, median: 2000 },
    skillsDemand: { 'JavaScript': 95, 'Python': 90, 'SQL': 85, 'Git': 80, 'Docker': 75, 'AWS': 70 },
    similarProfessions: ['DevOps', 'Data Scientist', 'QA Engineer', 'Product Manager'],
    requiredEducation: 'Высшее (бакалавриат/специалитет)',
    growthProspects: [
      { years: 0, position: 'Junior Developer' },
      { years: 2, position: 'Middle Developer' },
      { years: 4, position: 'Senior Developer' },
      { years: 7, position: 'Tech Lead' },
      { years: 10, position: 'Principal Engineer' },
    ],
  },
  finance: {
    employmentRate: 78,
    growthRate: 5,
    competition: 'medium',
    careerStability: 80,
    salaryLevel: 'medium',
    salaryRange: { min: 800, max: 2500, median: 1500 },
    skillsDemand: { '1C': 90, 'Excel': 95, 'МСФО': 70, 'SQL': 60, 'Английский': 85 },
    similarProfessions: ['Экономист', 'Аудитор', 'Финансовый аналитик', 'Бухгалтер'],
    requiredEducation: 'Высшее экономическое',
    growthProspects: [
      { years: 0, position: 'Младший специалист' },
      { years: 3, position: 'Экономист/Бухгалтер' },
      { years: 5, position: 'Старший бухгалтер' },
      { years: 8, position: 'Финансовый директор' },
    ],
  },
  marketing: {
    employmentRate: 75,
    growthRate: 8,
    competition: 'high',
    careerStability: 65,
    salaryLevel: 'medium',
    salaryRange: { min: 700, max: 2000, median: 1200 },
    skillsDemand: { 'Google Analytics': 85, 'SMM': 90, 'Контент': 80, 'Таргетинг': 85, 'SEO': 70 },
    similarProfessions: ['SMM-менеджер', 'PR-специалист', 'Бренд-менеджер', 'Контент-менеджер'],
    requiredEducation: 'Высшее (маркетинг/PR)',
    growthProspects: [
      { years: 0, position: 'Младший маркетолог' },
      { years: 2, position: 'Маркетолог' },
      { years: 5, position: 'Senior маркетолог' },
      { years: 8, position: 'Marketing Director' },
    ],
  },
  engineering: {
    employmentRate: 80,
    growthRate: 4,
    competition: 'medium',
    careerStability: 85,
    salaryLevel: 'medium',
    salaryRange: { min: 900, max: 2200, median: 1400 },
    skillsDemand: { 'AutoCAD': 90, 'SolidWorks': 85, 'Проектирование': 80, 'СНиП': 70, 'English': 60 },
    similarProfessions: ['Конструктор', 'Технолог', 'Проектировщик', 'Энергетик'],
    requiredEducation: 'Высшее техническое',
    growthProspects: [
      { years: 0, position: 'Инженер-конструктор' },
      { years: 3, position: 'Ведущий инженер' },
      { years: 6, position: 'Главный инженер' },
      { years: 10, position: 'Технический директор' },
    ],
  },
  medicine: {
    employmentRate: 95,
    growthRate: 7,
    competition: 'high',
    careerStability: 95,
    salaryLevel: 'high',
    salaryRange: { min: 1200, max: 3500, median: 2000 },
    skillsDemand: { 'Клиническая диагностика': 90, 'Медицинская документация': 85, 'Первая помощь': 95, 'Лабораторная': 75 },
    similarProfessions: ['Врач-специалист', 'Фармацевт', 'Медсестра', 'Лаборант'],
    requiredEducation: 'Специалитет (6 лет) + ординатура',
    growthProspects: [
      { years: 0, position: 'Интерн' },
      { years: 1, position: 'Врач-ординатор' },
      { years: 5, position: 'Врач-специалист' },
      { years: 10, position: 'Заведующий отделением' },
    ],
  },
  law: {
    employmentRate: 65,
    growthRate: 2,
    competition: 'high',
    careerStability: 70,
    salaryLevel: 'low',
    salaryRange: { min: 600, max: 3000, median: 1200 },
    skillsDemand: { 'Гражданское право': 85, 'Уголовное право': 80, 'Документооборот': 75, 'Английский': 70 },
    similarProfessions: ['Юрист', 'Нотариус', 'Адвокат', 'Судья'],
    requiredEducation: 'Специалитет (5 лет)',
    growthProspects: [
      { years: 0, position: 'Помощник юриста' },
      { years: 2, position: 'Юрист' },
      { years: 5, position: 'Старший юрист' },
      { years: 10, position: 'Партнёр/Директор' },
    ],
  },
  education: {
    employmentRate: 70,
    growthRate: 1,
    competition: 'low',
    careerStability: 90,
    salaryLevel: 'low',
    salaryRange: { min: 500, max: 1200, median: 750 },
    skillsDemand: { 'Педагогика': 90, 'Психология': 80, 'Методика': 85, 'IT в образовании': 70 },
    similarProfessions: ['Учитель', 'Преподаватель', 'Психолог', 'Методист'],
    requiredEducation: 'Бакалавриат (4 года) + магистратура',
    growthProspects: [
      { years: 0, position: 'Учитель/Преподаватель' },
      { years: 5, position: 'Старший преподаватель' },
      { years: 10, position: 'Доцент' },
      { years: 15, position: 'Профессор/Директор' },
    ],
  },
  design: {
    employmentRate: 72,
    growthRate: 10,
    competition: 'high',
    careerStability: 60,
    salaryLevel: 'medium',
    salaryRange: { min: 800, max: 2500, median: 1400 },
    skillsDemand: { 'Figma': 95, 'Adobe Suite': 90, 'Прототипирование': 85, 'UX Research': 75, 'Motion': 65 },
    similarProfessions: ['UI/UX дизайнер', 'Графический дизайнер', 'Иллюстратор', 'Арт-директор'],
    requiredEducation: 'Бакалавриат (дизайн) или курсы',
    growthProspects: [
      { years: 0, position: 'Junior Designer' },
      { years: 2, position: 'Designer' },
      { years: 5, position: 'Senior Designer' },
      { years: 8, position: 'Art Director' },
    ],
  },
  architecture: {
    employmentRate: 68,
    growthRate: 4,
    competition: 'high',
    careerStability: 70,
    salaryLevel: 'medium',
    salaryRange: { min: 900, max: 2800, median: 1600 },
    skillsDemand: { 'AutoCAD': 90, 'Revit': 85, 'SketchUp': 80, '3ds Max': 75, 'СНиП': 85 },
    similarProfessions: ['Архитектор', 'Проектировщик', 'Ландшафтный дизайнер', 'Визуализатор'],
    requiredEducation: 'Специалитет (6 лет)',
    growthProspects: [
      { years: 0, position: 'Младший архитектор' },
      { years: 3, position: 'Архитектор' },
      { years: 7, position: 'Ведущий архитектор' },
      { years: 12, position: 'Главный архитектор' },
    ],
  },
  media: {
    employmentRate: 60,
    growthRate: 5,
    competition: 'very_high',
    careerStability: 50,
    salaryLevel: 'low',
    salaryRange: { min: 500, max: 1800, median: 900 },
    skillsDemand: { 'Написание текстов': 90, 'Монтаж': 80, 'SMM': 85, 'Фото/Видео': 75, 'Копирайтинг': 85 },
    similarProfessions: ['Журналист', 'Видеограф', 'Контент-менеджер', 'Продюсер'],
    requiredEducation: 'Бакалавриат (журналистика/медиа)',
    growthProspects: [
      { years: 0, position: 'Стажёр/Копирайтер' },
      { years: 2, position: 'Журналист/Контент' },
      { years: 5, position: 'Редактор/Продюсер' },
      { years: 10, position: 'Главный редактор' },
    ],
  },
};

export function CareerProspectsCalculator({ className }: { className?: string }) {
  const [profession, setProfession] = useState('it');
  const [experience, setExperience] = useState(0);
  const [city, setCity] = useState('Минск');
  const [skills, setSkills] = useState({
    english: 50,
    certificates: 0,
    leadership: 0,
  });
  const [activeTab, setActiveTab] = useState('calculator');

  const data = careerDatabase[profession];

  const calculateProspects = useMemo(() => {
    const skillScore = 
      (skills.english >= 70 ? 20 : skills.english >= 50 ? 12 : 5) +
      Math.min(skills.certificates * 8, 25) +
      (skills.leadership >= 50 ? 15 : 0);

    const expBonus = experience < 1 ? -5 : experience < 3 ? 5 : experience < 5 ? 10 : 15;
    
    const cityBonus = city === 'Минск' ? 10 : city === 'Гомель' || city === 'Брест' ? 5 : 0;
    
    const employmentChance = Math.min(98, Math.max(30, 
      data.employmentRate + skillScore + expBonus + cityBonus
    ));
    
    const careerGrowth = Math.min(95, Math.max(20, 
      data.growthRate * 5 + skillScore + expBonus
    ));

    const stabilityScore = data.careerStability + (experience > 3 ? 10 : 0);

    const competitionScore = {
      'very_high': 40,
      'high': 55,
      'medium': 70,
      'low': 85,
    }[data.competition];

    return {
      employmentChance: Math.round(employmentChance),
      careerGrowth: Math.round(careerGrowth),
      stabilityScore: Math.round(stabilityScore),
      competitionScore,
      skillScore,
    };
  }, [profession, experience, city, skills, data]);

  const getCompetitionBadge = (comp: string) => {
    switch (comp) {
      case 'very_high':
        return <Badge className="bg-red-500">Очень высокая</Badge>;
      case 'high':
        return <Badge className="bg-orange-500">Высокая</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Средняя</Badge>;
      case 'low':
        return <Badge className="bg-green-500">Низкая</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-blue-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <section className={cn("py-16 bg-background", className)}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-display font-bold text-foreground">
              Карьерные перспективы
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Оцените свои шансы на трудоустройство, карьерный рост и стабильность в выбранной профессии.
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="calculator">Оценка перспектив</TabsTrigger>
            <TabsTrigger value="growth">Карьерный рост</TabsTrigger>
            <TabsTrigger value="skills">Спрос на навыки</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Ваш профиль</CardTitle>
                  <CardDescription>Настройте параметры</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Профессия</Label>
                    <Select value={profession} onValueChange={setProfession}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="it">IT-специалист</SelectItem>
                        <SelectItem value="finance">Финансы/Бухгалтерия</SelectItem>
                        <SelectItem value="marketing">Маркетинг/SMM</SelectItem>
                        <SelectItem value="design">Дизайн</SelectItem>
                        <SelectItem value="architecture">Архитектура</SelectItem>
                        <SelectItem value="engineering">Инженер</SelectItem>
                        <SelectItem value="medicine">Медицина</SelectItem>
                        <SelectItem value="law">Юриспруденция</SelectItem>
                        <SelectItem value="education">Образование</SelectItem>
                        <SelectItem value="media">Медиа/Журналистика</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Город</Label>
                    <Select value={city} onValueChange={setCity}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Минск">Минск</SelectItem>
                        <SelectItem value="Гомель">Гомель</SelectItem>
                        <SelectItem value="Брест">Брест</SelectItem>
                        <SelectItem value="Витебск">Витебск</SelectItem>
                        <SelectItem value="Гродно">Гродно</SelectItem>
                        <SelectItem value="Могилев">Могилев</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>Опыт работы (лет)</Label>
                      <span className="font-semibold text-primary">{experience}</span>
                    </div>
                    <Slider value={[experience]} onValueChange={(v) => setExperience(v[0])} min={0} max={15} step={1} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>Уровень английского ({skills.english}%)</Label>
                    </div>
                    <Slider value={[skills.english]} onValueChange={(v) => setSkills(s => ({ ...s, english: v[0] }))} min={0} max={100} step={10} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>Сертификаты ({skills.certificates})</Label>
                    </div>
                    <Slider value={[skills.certificates]} onValueChange={(v) => setSkills(s => ({ ...s, certificates: v[0] }))} min={0} max={5} step={1} />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle>Перспективы трудоустройства</CardTitle>
                  <CardDescription>{profession === 'it' ? 'IT-специалист' : profession === 'finance' ? 'Финансы' : profession === 'marketing' ? 'Маркетинг' : profession === 'design' ? 'Дизайн' : profession === 'architecture' ? 'Архитектура' : profession === 'engineering' ? 'Инженер' : profession === 'medicine' ? 'Медицина' : profession === 'law' ? 'Юриспруденция' : profession === 'education' ? 'Образование' : 'Медиа'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          Шанс трудоустройства
                        </span>
                        <span className="text-sm font-bold">{calculateProspects.employmentChance}%</span>
                      </div>
                      <Progress value={calculateProspects.employmentChance} className="h-3" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Карьерный рост
                        </span>
                        <span className="text-sm font-bold">{calculateProspects.careerGrowth}%</span>
                      </div>
                      <Progress value={calculateProspects.careerGrowth} className="h-3" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Стабильность карьеры
                        </span>
                        <span className="text-sm font-bold">{calculateProspects.stabilityScore}%</span>
                      </div>
                      <Progress value={calculateProspects.stabilityScore} className="h-3" />
                    </div>
                  </div>

                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Уровень зарплаты
                      </span>
                      <Badge className={data.salaryLevel === 'very_high' ? 'bg-purple-500' : data.salaryLevel === 'high' ? 'bg-green-500' : data.salaryLevel === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}>
                        {data.salaryLevel === 'very_high' ? 'Очень высокая' : data.salaryLevel === 'high' ? 'Высокая' : data.salaryLevel === 'medium' ? 'Средняя' : 'Низкая'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-muted-foreground">Диапазон (BYN)</p>
                        <p className="text-lg font-bold">{data.salaryRange.min.toLocaleString()} - {data.salaryRange.max.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Медиана</p>
                        <p className="text-xl font-bold text-primary">{data.salaryRange.median.toLocaleString()} BYN</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-secondary/50 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Конкуренция</p>
                      {getCompetitionBadge(data.competition)}
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Рост рынка</p>
                      <p className="font-bold text-green-500">+{data.growthRate}%/год</p>
                    </div>
                  </div>

                  <div className="p-4 bg-primary/5 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <GraduationCap className="w-4 h-4 text-primary mt-0.5" />
                      <p className="text-sm font-medium">Образование</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{data.requiredEducation}</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Оценка основана на анализе рынка труда Беларуси</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="growth">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Карьерная лестница
                </CardTitle>
                <CardDescription>Типичный путь развития в профессии</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                  <div className="space-y-6">
                    {data.growthProspects.map((step, index) => {
                      return (
                        <div key={index} className="relative flex items-start gap-4 pl-8">
                          <div className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 bg-secondary">
                            {index + 1}
                          </div>
                          <div className="flex-1 p-4 rounded-lg bg-secondary/30">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold">{step.position}</p>
                                <p className="text-sm text-muted-foreground">{step.years} лет опыта</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-accent/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Похожие профессии</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {data.similarProfessions.map(p => (
                          <Badge key={p} variant="outline">{p}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Спрос на навыки
                </CardTitle>
                <CardDescription>Какие навыки наиболее востребованы в {profession === 'it' ? 'IT' : profession === 'finance' ? 'финансах' : profession === 'marketing' ? 'маркетинге' : 'данной сфере'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(data.skillsDemand).map(([skill, demand]) => (
                    <div key={skill} className="p-4 bg-secondary/30 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{skill}</span>
                        <span className="text-sm text-muted-foreground">{demand}%</span>
                      </div>
                      <Progress value={demand} className="h-2" />
                    </div>
                  ))}
                 </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
