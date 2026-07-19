// ⚠️ Числовые значения обнулены — заменить на реальные данные из БД
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GraduationCap, Search, Briefcase, Clock, DollarSign, MapPin, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { useLanguage } from '@/hooks/useLanguage';


const UNIVERSITIES: string[] = ['⚠️ МОК-ДАННЫЕ: из БД'];

const MOCK_DATA: Record<string, Record<string, {
  employmentRate: number;
  avgSearchTime: number;
  avgSalary: number;
  inSpecialtyRate: number;
  countries: { name: string; percentage: number }[];
  topEmployers: string[];
}>> = {
  '⚠️ МОК-ДАННЫЕ: из БД': {
    '⚠️ МОК': {
      employmentRate: 0,
      avgSearchTime: 0,
      avgSalary: 0,
      inSpecialtyRate: 0,
      countries: [{ name: '⚠️ МОК', percentage: 0 }],
      topEmployers: ['⚠️ МОК'],
    },
  },
};

const STAT_KEYS: Record<string, string> = {
  employmentRate: '⚠️ МОК',
  avgSearchTime: '⚠️ МОК',
  avgSalary: '⚠️ МОК',
  inSpecialtyRate: '⚠️ МОК',
};

const COLORS = ['#ccc', '#ccc', '#ccc'];

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '12px',
  color: 'hsl(var(--foreground))',
};

export default function SpecialtyAnalytics() {
  const { t } = useLanguage();
  const [selectedUni, setSelectedUni] = useState('БГУИР');
  const [selectedSpec, setSelectedSpec] = useState('Программная инженерия');

  const specialities = Object.keys(MOCK_DATA[selectedUni] || {});

  useEffect(() => {
    if (specialities.length > 0 && !MOCK_DATA[selectedUni]?.[selectedSpec]) {
      setSelectedSpec(specialities[0]);
    }
  }, [selectedUni, selectedSpec]);

  const currentData = MOCK_DATA[selectedUni]?.[selectedSpec];

  const STAT_CARDS = [
    { key: 'employmentRate', suffix: '%', color: 'text-gray-500', bg: 'bg-gray-500/5', icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="py-16">
          <div className="section-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-6 h-6 text-primary" />
                <h1 className="text-3xl font-display font-bold text-foreground">{t('analytics.specialties.title')}</h1>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                {t('analytics.specialties.subtitle')}
              </p>
            </motion.div>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="w-64">
                <Select value={selectedUni} onValueChange={(v) => { setSelectedUni(v); setSelectedSpec(''); }}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('analytics.specialties.selectUni')} />
                  </SelectTrigger>
                  <SelectContent>
                    {UNIVERSITIES.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-72">
                <Select value={selectedSpec || specialities[0]} onValueChange={setSelectedSpec}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('analytics.specialties.selectSpec')} />
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
                          <p className="text-sm text-muted-foreground">{t(STAT_KEYS[card.key])}</p>
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
                      {t('analytics.specialties.countries')}
                    </h3>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={currentData.countries} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} angle={-45} textAnchor="end" />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                        <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${value}%`, t('analytics.specialties.share')]} />
                        <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                          {currentData.countries.map((_, i) => <Cell key={'country-cell-' + i} fill={COLORS[i % COLORS.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-elevated p-6">
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary" />
                      {t('analytics.specialties.topEmployers')}
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
                <p className="text-muted-foreground">{t('analytics.specialties.empty')}</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
