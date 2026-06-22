import { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { GraduationCap, Map as MapIcon, Briefcase, Building2, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';


const SPECIALTIES = [
  'Программная инженерия (БГУИР)',
  'Вычислительные машины (БГУИР)',
  'Информационные технологии (БГУИР)',
  'Прикладная математика (БГУ)',
  'Машиностроение (БНТУ)',
  'Энергетика (БНТУ)',
];

const MOCK_DATA: Record<string, {
  industries: { name: string; percentage: number; color: string }[];
  employers: { name: string; count: number }[];
  totalGraduates: number;
  topCountries: string[];
}> = {
  'Программная инженерия (БГУИР)': {
    totalGraduates: 245,
    topCountries: ['Беларусь', 'Польша', 'Литва', 'Германия', 'США'],
    industries: [
      { name: 'IT и разработка', percentage: 68, color: '#3B82F6' },
      { name: 'Финансы', percentage: 10, color: '#14B8A6' },
      { name: 'Консалтинг', percentage: 7, color: '#A855F7' },
      { name: 'Собственный бизнес', percentage: 6, color: '#F59E0B' },
      { name: 'Наука и образование', percentage: 4, color: '#EF4444' },
      { name: 'Другие', percentage: 5, color: '#6366F1' },
    ],
    employers: [
      { name: 'EPAM Systems', count: 45 },
      { name: 'Wargaming', count: 28 },
      { name: 'IBA Group', count: 22 },
      { name: 'Andersen', count: 18 },
      { name: 'ISsoft', count: 15 },
      { name: 'Yandex', count: 12 },
      { name: 'JetBrains', count: 10 },
      { name: 'Playtika', count: 8 },
    ],
  },
  'Вычислительные машины (БГУИР)': {
    totalGraduates: 180,
    topCountries: ['Беларусь', 'Польша', 'Россия', 'Литва'],
    industries: [
      { name: 'IT и разработка', percentage: 58, color: '#3B82F6' },
      { name: 'Производство', percentage: 12, color: '#14B8A6' },
      { name: 'Финансы', percentage: 10, color: '#A855F7' },
      { name: 'Наука и образование', percentage: 8, color: '#F59E0B' },
      { name: 'Собственный бизнес', percentage: 5, color: '#EF4444' },
      { name: 'Другие', percentage: 7, color: '#6366F1' },
    ],
    employers: [
      { name: 'EPAM Systems', count: 30 },
      { name: 'Intel', count: 20 },
      { name: 'IBA Group', count: 18 },
      { name: 'Wargaming', count: 15 },
      { name: 'SAIC', count: 12 },
      { name: 'Центр обработки данных', count: 8 },
    ],
  },
  'Информационные технологии (БГУИР)': {
    totalGraduates: 210,
    topCountries: ['Беларусь', 'Польша', 'Германия', 'Литва', 'США'],
    industries: [
      { name: 'IT и разработка', percentage: 72, color: '#3B82F6' },
      { name: 'Финансы и финтех', percentage: 8, color: '#14B8A6' },
      { name: 'Консалтинг', percentage: 6, color: '#A855F7' },
      { name: 'Собственный бизнес', percentage: 5, color: '#F59E0B' },
      { name: 'Наука и образование', percentage: 4, color: '#EF4444' },
      { name: 'Другие', percentage: 5, color: '#6366F1' },
    ],
    employers: [
      { name: 'EPAM Systems', count: 50 },
      { name: 'Yandex', count: 30 },
      { name: 'Wargaming', count: 25 },
      { name: 'JetBrains', count: 18 },
      { name: 'Andersen', count: 16 },
      { name: 'Godel Technologies', count: 12 },
    ],
  },
  'Прикладная математика (БГУ)': {
    totalGraduates: 120,
    topCountries: ['Беларусь', 'Польша', 'Германия', 'Россия'],
    industries: [
      { name: 'IT и разработка', percentage: 42, color: '#3B82F6' },
      { name: 'Финансы и банки', percentage: 20, color: '#14B8A6' },
      { name: 'Наука и образование', percentage: 15, color: '#A855F7' },
      { name: 'Консалтинг', percentage: 10, color: '#F59E0B' },
      { name: 'Собственный бизнес', percentage: 5, color: '#EF4444' },
      { name: 'Другие', percentage: 8, color: '#6366F1' },
    ],
    employers: [
      { name: 'EPAM Systems', count: 22 },
      { name: 'IBA Group', count: 15 },
      { name: 'Национальный банк', count: 12 },
      { name: 'БПС-Сбербанк', count: 10 },
      { name: 'Wargaming', count: 8 },
      { name: 'НИИ ПММ', count: 6 },
    ],
  },
  'Машиностроение (БНТУ)': {
    totalGraduates: 160,
    topCountries: ['Беларусь', 'Россия', 'Польша', 'Литва'],
    industries: [
      { name: 'Производство и промышленность', percentage: 45, color: '#3B82F6' },
      { name: 'IT и разработка', percentage: 15, color: '#14B8A6' },
      { name: 'Энергетика', percentage: 12, color: '#A855F7' },
      { name: 'Строительство', percentage: 10, color: '#F59E0B' },
      { name: 'Наука и образование', percentage: 8, color: '#EF4444' },
      { name: 'Другие', percentage: 10, color: '#6366F1' },
    ],
    employers: [
      { name: 'МАЗ', count: 30 },
      { name: 'МТЗ', count: 25 },
      { name: 'БелАЗ', count: 18 },
      { name: 'Горизонт', count: 12 },
      { name: 'Атлант', count: 10 },
      { name: 'EPAM Systems', count: 8 },
    ],
  },
  'Энергетика (БНТУ)': {
    totalGraduates: 140,
    topCountries: ['Беларусь', 'Россия', 'Польша', 'Литва'],
    industries: [
      { name: 'Энергетика', percentage: 50, color: '#3B82F6' },
      { name: 'Производство', percentage: 15, color: '#14B8A6' },
      { name: 'IT и разработка', percentage: 10, color: '#A855F7' },
      { name: 'Строительство', percentage: 8, color: '#F59E0B' },
      { name: 'Наука и образование', percentage: 7, color: '#EF4444' },
      { name: 'Другие', percentage: 10, color: '#6366F1' },
    ],
    employers: [
      { name: 'Белэнерго', count: 35 },
      { name: 'Минскэнерго', count: 28 },
      { name: 'Атомстрой', count: 15 },
      { name: 'Газпром', count: 12 },
      { name: 'Белорусская АЭС', count: 10 },
      { name: 'Энергетик', count: 8 },
    ],
  },
};

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '12px',
  color: 'hsl(var(--foreground))',
};

export default function CareerMap() {
  const [selected, setSelected] = useState(SPECIALTIES[0]);

  const data = MOCK_DATA[selected];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="py-16">
          <div className="section-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <MapIcon className="w-6 h-6 text-primary" />
                <h1 className="text-3xl font-display font-bold text-foreground">Карта карьер выпускников</h1>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                Куда идут работать выпускники? Распределение по сферам и топ работодатели.
              </p>
            </motion.div>

            <div className="w-80 mb-8">
              <Select value={selected} onValueChange={setSelected}>
                <SelectTrigger>
                  <SelectValue placeholder="Специальность" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALTIES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {data && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-sm text-muted-foreground">Выпускников</p>
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-primary">{data.totalGraduates}</p>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-sm text-muted-foreground">Сфер деятельности</p>
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-purple-500" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-purple-500">{data.industries.length}</p>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-sm text-muted-foreground">Стран трудоустройства</p>
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-amber-500" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-amber-500">{data.topCountries.length}</p>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-elevated p-6">
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Распределение по сферам</h3>
                    <ResponsiveContainer width="100%" height={380}>
                      <PieChart>
                        <Pie
                          data={data.industries}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={140}
                          paddingAngle={3}
                          dataKey="percentage"
                          nameKey="name"
                        >
                          {data.industries.map((_, i) => (
                            <Cell key={i} fill={data.industries[i].color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${value}%`, 'Доля']} />
                        <Legend
                          layout="vertical"
                          align="right"
                          verticalAlign="middle"
                          formatter={(value: string) => <span className="text-sm text-foreground">{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-elevated p-6">
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Топ работодатели</h3>
                    <ResponsiveContainer width="100%" height={380}>
                      <BarChart data={data.employers} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={90} />
                        <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [value, 'Выпускников']} />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                          {data.employers.map((_, i) => (
                            <Cell key={i} fill={['#3B82F6', '#14B8A6', '#A855F7', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#8B5CF6'][i % 8]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-elevated p-6">
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <MapIcon className="w-4 h-4 text-primary" />
                    География трудоустройства
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {data.topCountries.map((country) => (
                      <div key={country} className="px-4 py-2 rounded-xl bg-secondary/50 text-foreground font-medium text-sm">
                        {country}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
