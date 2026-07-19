// ⚠️ Числовые значения обнулены — заменить на реальные данные из БД
import { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { GraduationCap, Map as MapIcon, Briefcase, Building2, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { useLanguage } from '@/hooks/useLanguage';


interface CountryData {
  country: string;
  percentage: number;
}

interface IndustryData {
  name: string;
  percentage: number;
  color: string;
  graduates: number;
}

interface EmployerData {
  name: string;
  graduates: number;
}

interface CareerMapData {
  totalGraduates: number;
  topCountries: CountryData[];
  industries: IndustryData[];
  topEmployers: EmployerData[];
}

const SPECIALTIES: string[] = ['⚠️ МОК-ДАННЫЕ: загрузить из БД'];

const MOCK_DATA: Record<string, CareerMapData> = {
  '⚠️ МОК-ДАННЫЕ: загрузить из БД': {
    totalGraduates: 0,
    topCountries: [{ country: '⚠️ МОК', percentage: 0 }],
    industries: [{ name: '⚠️ МОК', percentage: 0, color: '#ccc', graduates: 0 }],
    topEmployers: [{ name: '⚠️ МОК', graduates: 0 }],
  }
};

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '12px',
  color: 'hsl(var(--foreground))',
};

export default function CareerMap() {
  const { t } = useLanguage();
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
                <h1 className="text-3xl font-display font-bold text-foreground">{t('careerMap.title')}</h1>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                {t('careerMap.subtitle')}
              </p>
            </motion.div>

            <div className="w-full sm:w-80 mb-8">
              <Select value={selected} onValueChange={setSelected}>
                <SelectTrigger>
                  <SelectValue placeholder={t('careerMap.selectSpec')} />
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
                      <p className="text-sm text-muted-foreground">{t('careerMap.statGraduates')}</p>
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-primary">{data.totalGraduates}</p>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-sm text-muted-foreground">{t('careerMap.statFields')}</p>
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-purple-500" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-purple-500">{data.industries.length}</p>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-sm text-muted-foreground">{t('careerMap.statCountries')}</p>
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-amber-500" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-amber-500">{data.topCountries.length}</p>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-elevated p-6">
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-4">{t('careerMap.chartDistribution')}</h3>
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
                            <Cell key={'industry-cell-' + i} fill={data.industries[i].color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${value}%`, t('careerMap.share')]} />
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
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-4">{t('careerMap.chartEmployers')}</h3>
                    <ResponsiveContainer width="100%" height={380}>
                      <BarChart data={data.employers} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={90} />
                        <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [value, t('careerMap.graduates')]} />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                          {data.employers.map((_, i) => (
                            <Cell key={'employer-cell-' + i} fill={['#3B82F6', '#14B8A6', '#A855F7', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#8B5CF6'][i % 8]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-elevated p-6">
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <MapIcon className="w-4 h-4 text-primary" />
                    {t('careerMap.chartGeography')}
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
