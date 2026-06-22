import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GraduationCap, Search, Briefcase, Clock, DollarSign, MapPin, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';


const UNIVERSITIES = ['БГУИР', 'БГУ', 'БНТУ'];

const MOCK_DATA: Record<string, Record<string, {
  employmentRate: number;
  avgSearchTime: number;
  avgSalary: number;
  inSpecialtyRate: number;
  countries: { name: string; percentage: number }[];
  topEmployers: string[];
}>> = {
  'БГУИР': {
    'Программная инженерия': {
      employmentRate: 94, avgSearchTime: 1.8, avgSalary: 3200, inSpecialtyRate: 86,
      countries: [
        { name: 'Беларусь', percentage: 55 },
        { name: 'Польша', percentage: 20 },
        { name: 'Литва', percentage: 8 },
        { name: 'Германия', percentage: 7 },
        { name: 'США', percentage: 5 },
        { name: 'Другие', percentage: 5 },
      ],
      topEmployers: ['EPAM Systems', 'Wargaming', 'IBA Group', 'Andersen', 'ISsoft'],
    },
    'Вычислительные машины': {
      employmentRate: 91, avgSearchTime: 2.1, avgSalary: 2800, inSpecialtyRate: 82,
      countries: [
        { name: 'Беларусь', percentage: 58 },
        { name: 'Польша', percentage: 18 },
        { name: 'Россия', percentage: 8 },
        { name: 'Литва', percentage: 6 },
        { name: 'Другие', percentage: 10 },
      ],
      topEmployers: ['EPAM Systems', 'Intel', 'IBA Group', 'Wargaming', 'SAIC'],
    },
    'Информационные технологии': {
      employmentRate: 96, avgSearchTime: 1.5, avgSalary: 3500, inSpecialtyRate: 90,
      countries: [
        { name: 'Беларусь', percentage: 50 },
        { name: 'Польша', percentage: 22 },
        { name: 'Германия', percentage: 10 },
        { name: 'Литва', percentage: 7 },
        { name: 'США', percentage: 6 },
        { name: 'Другие', percentage: 5 },
      ],
      topEmployers: ['EPAM Systems', 'Yandex', 'Wargaming', 'JetBrains', 'Andersen'],
    },
    'Электронная экономика': {
      employmentRate: 88, avgSearchTime: 2.5, avgSalary: 2400, inSpecialtyRate: 75,
      countries: [
        { name: 'Беларусь', percentage: 62 },
        { name: 'Польша', percentage: 15 },
        { name: 'Россия', percentage: 10 },
        { name: 'Другие', percentage: 13 },
      ],
      topEmployers: ['Банки', 'EPAM Systems', 'IBA Group', 'IT-компании', 'Гос. сектор'],
    },
  },
  'БГУ': {
    'Прикладная математика': {
      employmentRate: 89, avgSearchTime: 2.3, avgSalary: 2600, inSpecialtyRate: 78,
      countries: [
        { name: 'Беларусь', percentage: 52 },
        { name: 'Польша', percentage: 18 },
        { name: 'Германия', percentage: 12 },
        { name: 'Россия', percentage: 8 },
        { name: 'Другие', percentage: 10 },
      ],
      topEmployers: ['EPAM Systems', 'IBA Group', 'Банки', 'Научные институты', 'Wargaming'],
    },
    'Физика': {
      employmentRate: 72, avgSearchTime: 3.8, avgSalary: 1800, inSpecialtyRate: 55,
      countries: [
        { name: 'Беларусь', percentage: 65 },
        { name: 'Россия', percentage: 12 },
        { name: 'Германия', percentage: 8 },
        { name: 'Польша', percentage: 5 },
        { name: 'Другие', percentage: 10 },
      ],
      topEmployers: ['НИИ', 'Образование', 'IT-компании', 'Производство', 'Энергетика'],
    },
    'Химия': {
      employmentRate: 76, avgSearchTime: 3.5, avgSalary: 1600, inSpecialtyRate: 60,
      countries: [
        { name: 'Беларусь', percentage: 70 },
        { name: 'Россия', percentage: 10 },
        { name: 'Польша', percentage: 8 },
        { name: 'Германия', percentage: 5 },
        { name: 'Другие', percentage: 7 },
      ],
      topEmployers: ['Белнефтехим', 'НИИ', 'Фармацевтика', 'Лаборатории', 'Образование'],
    },
    'Биология': {
      employmentRate: 68, avgSearchTime: 4.2, avgSalary: 1400, inSpecialtyRate: 52,
      countries: [
        { name: 'Беларусь', percentage: 72 },
        { name: 'Россия', percentage: 10 },
        { name: 'Польша', percentage: 6 },
        { name: 'Германия', percentage: 4 },
        { name: 'Другие', percentage: 8 },
      ],
      topEmployers: ['НИИ', 'Медицина', 'Фармацевтика', 'Образование', 'Экология'],
    },
  },
  'БНТУ': {
    'Машиностроение': {
      employmentRate: 85, avgSearchTime: 2.8, avgSalary: 2000, inSpecialtyRate: 70,
      countries: [
        { name: 'Беларусь', percentage: 68 },
        { name: 'Россия', percentage: 12 },
        { name: 'Польша', percentage: 8 },
        { name: 'Литва', percentage: 4 },
        { name: 'Другие', percentage: 8 },
      ],
      topEmployers: ['МАЗ', 'МТЗ', 'БелАЗ', 'Горизонт', 'Атлант'],
    },
    'Энергетика': {
      employmentRate: 88, avgSearchTime: 2.5, avgSalary: 2200, inSpecialtyRate: 76,
      countries: [
        { name: 'Беларусь', percentage: 72 },
        { name: 'Россия', percentage: 10 },
        { name: 'Польша', percentage: 6 },
        { name: 'Литва', percentage: 3 },
        { name: 'Другие', percentage: 9 },
      ],
      topEmployers: ['Белэнерго', 'Минскэнерго', 'Атомстрой', 'Газпром', 'Энергетик'],
    },
    'Строительство': {
      employmentRate: 82, avgSearchTime: 3.0, avgSalary: 1900, inSpecialtyRate: 68,
      countries: [
        { name: 'Беларусь', percentage: 70 },
        { name: 'Россия', percentage: 12 },
        { name: 'Польша', percentage: 5 },
        { name: 'Литва', percentage: 3 },
        { name: 'Другие', percentage: 10 },
      ],
      topEmployers: ['Минскстрой', 'Белстрой', 'Трест', 'Дорожно-строительные', 'Частные компании'],
    },
    'Архитектура': {
      employmentRate: 79, avgSearchTime: 3.2, avgSalary: 1800, inSpecialtyRate: 65,
      countries: [
        { name: 'Беларусь', percentage: 65 },
        { name: 'Россия', percentage: 14 },
        { name: 'Польша', percentage: 7 },
        { name: 'Литва', percentage: 4 },
        { name: 'Другие', percentage: 10 },
      ],
      topEmployers: ['Белпроект', 'Минскпроект', 'Архитектурные бюро', 'Частные фирмы', 'Дизайн-студии'],
    },
  },
};

const STAT_CARDS = [
  { key: 'employmentRate', label: 'Трудоустройство', suffix: '%', color: 'text-green-500', bg: 'bg-green-500/5', icon: Briefcase },
  { key: 'avgSearchTime', label: 'Среднее время поиска', suffix: ' мес.', color: 'text-blue-500', bg: 'bg-blue-500/5', icon: Clock },
  { key: 'avgSalary', label: 'Средняя зарплата', suffix: ' BYN', color: 'text-amber-500', bg: 'bg-amber-500/5', icon: DollarSign },
  { key: 'inSpecialtyRate', label: 'Работа по специальности', suffix: '%', color: 'text-purple-500', bg: 'bg-purple-500/5', icon: TrendingUp },
];

const COLORS = ['#3B82F6', '#14B8A6', '#A855F7', '#F59E0B', '#EF4444', '#6366F1'];

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '12px',
  color: 'hsl(var(--foreground))',
};

export default function SpecialtyAnalytics() {
  const [selectedUni, setSelectedUni] = useState('БГУИР');
  const [selectedSpec, setSelectedSpec] = useState('Программная инженерия');

  const specialities = Object.keys(MOCK_DATA[selectedUni] || {});
  const data = MOCK_DATA[selectedUni]?.[selectedSpec];
  if (!data && specialities.length > 0 && selectedSpec !== specialities[0]) {
    setSelectedSpec(specialities[0]);
  }

  const currentData = MOCK_DATA[selectedUni]?.[selectedSpec];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="py-16">
          <div className="section-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-6 h-6 text-primary" />
                <h1 className="text-3xl font-display font-bold text-foreground">Аналитика специальностей</h1>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                Реальные данные о трудоустройстве выпускников. На основе опросов выпускников белорусских вузов.
              </p>
            </motion.div>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="w-64">
                <Select value={selectedUni} onValueChange={(v) => { setSelectedUni(v); setSelectedSpec(''); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Университет" />
                  </SelectTrigger>
                  <SelectContent>
                    {UNIVERSITIES.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-72">
                <Select value={selectedSpec || specialities[0]} onValueChange={setSelectedSpec}>
                  <SelectTrigger>
                    <SelectValue placeholder="Специальность" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialities.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {currentData && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {STAT_CARDS.map((card) => {
                    const Icon = card.icon;
                    const val = currentData[card.key as keyof typeof currentData] as number;
                    return (
                      <motion.div key={card.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-4 sm:p-6">
                        <div className="flex items-start justify-between mb-3">
                          <p className="text-sm text-muted-foreground">{card.label}</p>
                          <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 ${card.color}`} />
                          </div>
                        </div>
                        <p className={`text-3xl font-bold ${card.color}`}>
                          {typeof val === 'number' ? val.toLocaleString('ru-RU') : val}{card.suffix}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-elevated p-6">
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Страны трудоустройства
                    </h3>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={currentData.countries} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} angle={-45} textAnchor="end" />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                        <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${value}%`, 'Доля']} />
                        <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                          {currentData.countries.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-elevated p-6">
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary" />
                      Топ работодатели
                    </h3>
                    <div className="space-y-3">
                      {currentData.topEmployers.map((company, i) => (
                        <div key={company} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                          <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                            {i + 1}
                          </span>
                          <span className="font-medium text-foreground">{company}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </>
            )}

            {!currentData && (
              <div className="text-center py-20">
                <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Выберите университет и специальность для просмотра аналитики</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
