import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, TrendingDown, Info, ArrowRight, DollarSign, MapPin, Building, Calendar, AlertTriangle, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface SalaryData {
  baseMin: number;
  baseMax: number;
  median: number;
  growth: number;
  volatility: number;
  demand: 'high' | 'medium' | 'low';
  inflationFactor: number;
  cityFactors: Record<string, number>;
  experienceGrowth: { years: number; minPercent: number; maxPercent: number }[];
}

const salaryDatabase: Record<string, SalaryData> = {
  it: {
    baseMin: 1500,
    baseMax: 3000,
    median: 2200,
    growth: 12,
    volatility: 0.3,
    demand: 'high',
    inflationFactor: 0.08,
    cityFactors: { 'Минск': 1.2, 'Гомель': 0.85, 'Брест': 0.82, 'Витебск': 0.8, 'Гродно': 0.83, 'Могилев': 0.78 },
    experienceGrowth: [
      { years: 0, minPercent: 0.7, maxPercent: 0.85 },
      { years: 1, minPercent: 0.85, maxPercent: 1.0 },
      { years: 2, minPercent: 1.0, maxPercent: 1.3 },
      { years: 3, minPercent: 1.2, maxPercent: 1.5 },
      { years: 5, minPercent: 1.5, maxPercent: 2.0 },
      { years: 7, minPercent: 1.8, maxPercent: 2.5 },
      { years: 10, minPercent: 2.2, maxPercent: 3.5 },
    ],
  },
  finance: {
    baseMin: 1000,
    baseMax: 2000,
    median: 1500,
    growth: 6,
    volatility: 0.2,
    demand: 'medium',
    inflationFactor: 0.06,
    cityFactors: { 'Минск': 1.25, 'Гомель': 0.88, 'Брест': 0.85, 'Витебск': 0.83, 'Гродно': 0.86, 'Могилев': 0.8 },
    experienceGrowth: [
      { years: 0, minPercent: 0.75, maxPercent: 0.9 },
      { years: 2, minPercent: 0.9, maxPercent: 1.15 },
      { years: 4, minPercent: 1.1, maxPercent: 1.4 },
      { years: 6, minPercent: 1.3, maxPercent: 1.7 },
      { years: 8, minPercent: 1.5, maxPercent: 2.0 },
    ],
  },
  marketing: {
    baseMin: 800,
    baseMax: 1600,
    median: 1200,
    growth: 5,
    volatility: 0.25,
    demand: 'medium',
    inflationFactor: 0.055,
    cityFactors: { 'Минск': 1.3, 'Гомель': 0.82, 'Брест': 0.8, 'Витебск': 0.78, 'Гродно': 0.81, 'Могилев': 0.75 },
    experienceGrowth: [
      { years: 0, minPercent: 0.7, maxPercent: 0.85 },
      { years: 2, minPercent: 0.9, maxPercent: 1.2 },
      { years: 4, minPercent: 1.15, maxPercent: 1.5 },
      { years: 6, minPercent: 1.35, maxPercent: 1.8 },
      { years: 8, minPercent: 1.5, maxPercent: 2.1 },
    ],
  },
  engineering: {
    baseMin: 900,
    baseMax: 1800,
    median: 1300,
    growth: 4,
    volatility: 0.18,
    demand: 'medium',
    inflationFactor: 0.05,
    cityFactors: { 'Минск': 1.15, 'Гомель': 0.9, 'Брест': 0.88, 'Витебск': 0.92, 'Гродно': 0.9, 'Могилев': 0.85 },
    experienceGrowth: [
      { years: 0, minPercent: 0.75, maxPercent: 0.9 },
      { years: 2, minPercent: 0.9, maxPercent: 1.15 },
      { years: 4, minPercent: 1.1, maxPercent: 1.35 },
      { years: 6, minPercent: 1.25, maxPercent: 1.55 },
      { years: 8, minPercent: 1.4, maxPercent: 1.8 },
    ],
  },
  medicine: {
    baseMin: 1100,
    baseMax: 2500,
    median: 1700,
    growth: 7,
    volatility: 0.1,
    demand: 'high',
    inflationFactor: 0.07,
    cityFactors: { 'Минск': 1.1, 'Гомель': 0.95, 'Брест': 0.93, 'Витебск': 0.94, 'Гродно': 0.92, 'Могилев': 0.9 },
    experienceGrowth: [
      { years: 0, minPercent: 0.8, maxPercent: 0.95 },
      { years: 3, minPercent: 0.95, maxPercent: 1.15 },
      { years: 5, minPercent: 1.1, maxPercent: 1.35 },
      { years: 8, minPercent: 1.25, maxPercent: 1.55 },
      { years: 12, minPercent: 1.4, maxPercent: 1.8 },
    ],
  },
  law: {
    baseMin: 800,
    baseMax: 2500,
    median: 1400,
    growth: 3,
    volatility: 0.4,
    demand: 'low',
    inflationFactor: 0.045,
    cityFactors: { 'Минск': 1.35, 'Гомель': 0.8, 'Брест': 0.78, 'Витебск': 0.76, 'Гродно': 0.79, 'Могилев': 0.74 },
    experienceGrowth: [
      { years: 0, minPercent: 0.5, maxPercent: 0.7 },
      { years: 2, minPercent: 0.65, maxPercent: 0.9 },
      { years: 5, minPercent: 0.85, maxPercent: 1.2 },
      { years: 8, minPercent: 1.1, maxPercent: 1.5 },
      { years: 15, minPercent: 1.4, maxPercent: 2.5 },
    ],
  },
  education: {
    baseMin: 600,
    baseMax: 1200,
    median: 850,
    growth: 2,
    volatility: 0.08,
    demand: 'medium',
    inflationFactor: 0.04,
    cityFactors: { 'Минск': 1.1, 'Гомель': 0.95, 'Брест': 0.93, 'Витебск': 0.94, 'Гродно': 0.92, 'Могилев': 0.9 },
    experienceGrowth: [
      { years: 0, minPercent: 0.85, maxPercent: 1.0 },
      { years: 3, minPercent: 0.95, maxPercent: 1.1 },
      { years: 7, minPercent: 1.05, maxPercent: 1.2 },
      { years: 12, minPercent: 1.1, maxPercent: 1.3 },
      { years: 20, minPercent: 1.15, maxPercent: 1.4 },
    ],
  },
  design: {
    baseMin: 900,
    baseMax: 2200,
    median: 1400,
    growth: 8,
    volatility: 0.35,
    demand: 'medium',
    inflationFactor: 0.065,
    cityFactors: { 'Минск': 1.25, 'Гомель': 0.82, 'Брест': 0.8, 'Витебск': 0.78, 'Гродно': 0.81, 'Могилев': 0.76 },
    experienceGrowth: [
      { years: 0, minPercent: 0.65, maxPercent: 0.8 },
      { years: 2, minPercent: 0.85, maxPercent: 1.1 },
      { years: 4, minPercent: 1.05, maxPercent: 1.4 },
      { years: 6, minPercent: 1.25, maxPercent: 1.7 },
      { years: 10, minPercent: 1.5, maxPercent: 2.2 },
    ],
  },
  architecture: {
    baseMin: 1000,
    baseMax: 2500,
    median: 1600,
    growth: 4,
    volatility: 0.25,
    demand: 'medium',
    inflationFactor: 0.055,
    cityFactors: { 'Минск': 1.2, 'Гомель': 0.85, 'Брест': 0.82, 'Витебск': 0.8, 'Гродно': 0.83, 'Могилев': 0.78 },
    experienceGrowth: [
      { years: 0, minPercent: 0.7, maxPercent: 0.85 },
      { years: 2, minPercent: 0.85, maxPercent: 1.1 },
      { years: 5, minPercent: 1.05, maxPercent: 1.4 },
      { years: 8, minPercent: 1.25, maxPercent: 1.65 },
      { years: 12, minPercent: 1.45, maxPercent: 2.0 },
    ],
  },
  media: {
    baseMin: 700,
    baseMax: 1800,
    median: 1100,
    growth: 5,
    volatility: 0.45,
    demand: 'low',
    inflationFactor: 0.05,
    cityFactors: { 'Минск': 1.4, 'Гомель': 0.75, 'Брест': 0.72, 'Витебск': 0.7, 'Гродно': 0.73, 'Могилев': 0.68 },
    experienceGrowth: [
      { years: 0, minPercent: 0.55, maxPercent: 0.75 },
      { years: 2, minPercent: 0.75, maxPercent: 1.0 },
      { years: 5, minPercent: 1.0, maxPercent: 1.4 },
      { years: 8, minPercent: 1.25, maxPercent: 1.75 },
      { years: 12, minPercent: 1.5, maxPercent: 2.2 },
    ],
  },
};

export function SalaryCalculatorSection({ className }: { className?: string }) {
  const [profession, setProfession] = useState('it');
  const [experience, setExperience] = useState(2);
  const [city, setCity] = useState('Минск');
  const [skills, setSkills] = useState({
    english: 50,
    certificates: 0,
    leadership: 0,
  });
  const [year, setYear] = useState(2026);
  const [activeTab, setActiveTab] = useState('calculator');

  const data = salaryDatabase[profession];

  const getExperienceMultiplier = (exp: number) => {
    const growth = data.experienceGrowth;
    for (let i = growth.length - 1; i >= 0; i--) {
      if (exp >= growth[i].years) {
        if (i === growth.length - 1) {
          return { min: growth[i].minPercent, max: growth[i].maxPercent };
        }
        const next = growth[i + 1];
        const progress = (exp - growth[i].years) / (next.years - growth[i].years);
        return {
          min: growth[i].minPercent + (next.minPercent - growth[i].minPercent) * Math.min(1, progress),
          max: growth[i].maxPercent + (next.maxPercent - growth[i].maxPercent) * Math.min(1, progress),
        };
      }
    }
    return { min: 0.7, max: 0.85 };
  };

  const calculatedSalary = useMemo(() => {
    const cityFactor = data.cityFactors[city] || 1.0;
    const expMultiplier = getExperienceMultiplier(experience);
    
    const skillBonus = 
      (skills.english >= 70 ? 0.15 : skills.english >= 50 ? 0.08 : 0) +
      Math.min(skills.certificates * 0.05, 0.15) +
      (skills.leadership >= 50 ? 0.1 : 0);

    const baseMedian = data.median * cityFactor;
    const minSalary = Math.round(data.baseMin * cityFactor * expMultiplier.min * (1 + skillBonus));
    const maxSalary = Math.round(data.baseMax * cityFactor * expMultiplier.max * (1 + skillBonus));
    const medianSalary = Math.round((minSalary + maxSalary) / 2);

    const yearsFromNow = year - 2026;
    const inflationMultiplier = Math.pow(1 + data.inflationFactor, yearsFromNow);
    const projectedMin = Math.round(minSalary * inflationMultiplier);
    const projectedMax = Math.round(maxSalary * inflationMultiplier);

    return {
      min: minSalary,
      max: maxSalary,
      median: medianSalary,
      projectedMin,
      projectedMax,
      skillBonus: Math.round(skillBonus * 100),
      cityFactor,
      volatility: data.volatility,
      demand: data.demand,
      growth: data.growth,
    };
  }, [profession, experience, city, skills, year, data]);

  const getDemandBadge = (demand: string) => {
    switch (demand) {
      case 'high':
        return <Badge className="bg-green-500">Высокий спрос</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Средний спрос</Badge>;
      case 'low':
        return <Badge className="bg-red-500">Низкий спрос</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const getMarketPosition = () => {
    const avgMarket = (data.baseMin + data.baseMax) / 2;
    const position = ((calculatedSalary.median - avgMarket) / avgMarket) * 100;
    if (position >= 20) return { label: 'Выше рынка', color: 'text-green-500', bg: 'bg-green-500/10' };
    if (position >= -10) return { label: 'Средний', color: 'text-blue-500', bg: 'bg-blue-500/10' };
    return { label: 'Ниже рынка', color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
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
            <DollarSign className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-display font-bold text-foreground">
              Калькулятор зарплаты
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Рассчитайте ожидаемую зарплату с учётом опыта, города, навыков, инфляции и экономических факторов.
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="calculator">Калькулятор</TabsTrigger>
            <TabsTrigger value="trends">Тренды рынка</TabsTrigger>
            <TabsTrigger value="factors">Факторы</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Параметры</CardTitle>
                  <CardDescription>Настройте ваш профиль</CardDescription>
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
                        <SelectItem value="design">Дизайн (UI/UX, Графический)</SelectItem>
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
                        {Object.keys(data.cityFactors).map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
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
                      <Label>Английский ({skills.english}%)</Label>
                    </div>
                    <Slider value={[skills.english]} onValueChange={(v) => setSkills(s => ({ ...s, english: v[0] }))} min={0} max={100} step={10} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>Сертификаты ({skills.certificates})</Label>
                    </div>
                    <Slider value={[skills.certificates]} onValueChange={(v) => setSkills(s => ({ ...s, certificates: v[0] }))} min={0} max={5} step={1} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>Год прогноза</Label>
                      <span className="font-semibold text-primary">{year}</span>
                    </div>
                    <Slider value={[year]} onValueChange={(v) => setYear(v[0])} min={2026} max={2030} step={1} />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Результат
                    {getDemandBadge(calculatedSalary.demand)}
                  </CardTitle>
                  <CardDescription>
                    Диапазон зарплат с учётом всех факторов
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 bg-primary/5 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">Ожидаемая зарплата в {year} году</p>
                    <p className="text-3xl font-bold text-primary">
                      {calculatedSalary.projectedMin.toLocaleString()} - {calculatedSalary.projectedMax.toLocaleString()} BYN
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">в месяц (net)</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-secondary/50 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Текущая медиана</p>
                      <p className="font-bold">{calculatedSalary.median.toLocaleString()} BYN</p>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Бонус за навыки</p>
                      <p className="font-bold text-green-500">+{calculatedSalary.skillBonus}%</p>
                    </div>
                  </div>

                  <div className="p-4 bg-accent/30 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                      <p className="text-sm font-medium">Важные факторы</p>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Волатильность рынка: ±{Math.round(calculatedSalary.volatility * 100)}%</li>
                      <li>• Коэффициент города: x{calculatedSalary.cityFactor.toFixed(2)}</li>
                      <li>• Прогнозируемый рост: +{calculatedSalary.growth}% в год</li>
                      <li>• Инфляция: ~{Math.round(data.inflationFactor * 100)}% в год</li>
                    </ul>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Info className="w-4 h-4" />
                    <span>Расчёт основан на данных {data.baseMin.toLocaleString()}-{data.baseMax.toLocaleString()} BYN с rabota.by</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Тренды зарплат по годам
                </CardTitle>
                <CardDescription>Прогноз изменения зарплат с учётом инфляции и роста рынка</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[2026, 2027, 2028, 2029, 2030].map((y, i) => {
                    const yearData = salaryDatabase[profession];
                    const inflationMult = Math.pow(1 + yearData.inflationFactor, y - 2026);
                    const salaryMin = Math.round(calculatedSalary.min * inflationMult);
                    const salaryMax = Math.round(calculatedSalary.max * inflationMult);
                    
                    return (
                      <div key={y} className="flex items-center gap-4">
                        <div className="w-16 text-sm font-medium">{y}</div>
                        <div className="flex-1 h-8 bg-secondary/30 rounded-lg overflow-hidden relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${((i + 1) / 5) * 100}%` }}
                            transition={{ delay: i * 0.1 }}
                            className="h-full bg-gradient-to-r from-primary to-primary/70"
                          />
                          <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                            {salaryMin.toLocaleString()} - {salaryMax.toLocaleString()} BYN
                          </div>
                        </div>
                        <div className="w-12 text-xs text-muted-foreground text-right">
                          +{Math.round((inflationMult - 1) * 100)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 p-4 bg-yellow-500/10 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">О прогнозах</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Прогнозы учитывают среднегодовую инфляцию и исторический рост зарплат в отрасли. 
                        Реальные значения могут отличаться из-за экономических и политических факторов.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="factors">
            <Card>
              <CardHeader>
                <CardTitle>Факторы, влияющие на зарплату</CardTitle>
                <CardDescription>Как каждый фактор влияет на ваш доход</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Опыт работы
                    </h4>
                    <div className="space-y-2">
                      {data.experienceGrowth.slice(0, 5).map((exp) => (
                        <div key={exp.years} className="flex justify-between text-sm">
                          <span>{exp.years}+ лет</span>
                          <span className="text-muted-foreground">{Math.round(exp.minPercent * 100)}% - {Math.round(exp.maxPercent * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Город
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(data.cityFactors).sort((a, b) => b[1] - a[1]).map(([cityName, factor]) => (
                        <div key={cityName} className="flex justify-between text-sm">
                          <span>{cityName}</span>
                          <span className="text-muted-foreground">x{factor.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Экономические факторы
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Инфляция (в год)</span>
                        <span className="text-muted-foreground">{Math.round(data.inflationFactor * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Рост рынка (в год)</span>
                        <span className="text-green-500">+{data.growth}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Волатильность</span>
                        <span className="text-muted-foreground">±{Math.round(data.volatility * 100)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Навыки
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Английский B2+</span>
                        <span className="text-green-500">+15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Каждый сертификат</span>
                        <span className="text-green-500">+5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Лидерские навыки</span>
                        <span className="text-green-500">+10%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
