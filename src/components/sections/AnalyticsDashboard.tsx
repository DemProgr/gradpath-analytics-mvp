import { motion } from 'framer-motion';
import { GraduationCap, BarChart3, Users, TrendingUp, PieChart, ArrowUpRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';

export function AnalyticsDashboard() {
  const { data: universityCount } = useQuery({
    queryKey: ['university-count-dashboard'],
    queryFn: async () => {
      const { count } = await supabase
        .from('universities')
        .select('*', { count: 'exact', head: true });
      return count || 41;
    }
  });

  const { data: vacancyCount } = useQuery({
    queryKey: ['vacancy-count-dashboard'],
    queryFn: async () => {
      const { count } = await supabase
        .from('vacancies')
        .select('*', { count: 'exact', head: true });
      return count || 10538;
    }
  });

  const stats = [
    { label: 'Total Universities', value: universityCount || 41, icon: GraduationCap, color: 'bg-blue-500' },
    { label: 'Total Specialties', value: 653, icon: BarChart3, color: 'bg-purple-500' },
    { label: 'Total Vacancies', value: vacancyCount || 10538, icon: Users, color: 'bg-green-500' },
    { label: 'Average Salary', value: '1,473', suffix: 'BYN', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  const categories = [
    { name: 'Engineering', value: 35, color: '#3b82f6' },
    { name: 'Business', value: 25, color: '#8b5cf6' },
    { name: 'Medicine', value: 20, color: '#10b981' },
    { name: 'Arts', value: 12, color: '#f59e0b' },
    { name: 'IT', value: 8, color: '#ef4444' },
  ];

  const yearlyData = [
    { year: '2020', value: 4200 },
    { year: '2021', value: 4800 },
    { year: '2022', value: 5600 },
    { year: '2023', value: 7200 },
    { year: '2024', value: 8900 },
    { year: '2025', value: 10538 },
  ];

  const tableData = [
    { name: 'Alex Johnson', score: 386, university: 'BSU', faculty: 'Computer Science' },
    { name: 'Maria Petrova', score: 392, university: 'BSUIR', faculty: 'Engineering' },
    { name: 'Ivan Sokolov', score: 378, university: 'BNTU', faculty: 'Business' },
    { name: 'Anna Kim', score: 395, university: 'BSU', faculty: 'Medicine' },
    { name: 'Dmitry Ivanov', score: 381, university: 'BSPU', faculty: 'Education' },
  ];

  const maxBarValue = Math.max(...yearlyData.map(d => d.value));

  return (
    <section className="py-12 sm:py-16">
      <div className="section-container">
        {/* Analytics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-foreground">GradPath Analytics</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground">Analytics</button>
                <button className="px-3 py-1.5 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted">Applicants</button>
                <button className="px-3 py-1.5 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted">Students</button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}{stat.suffix && <span className="text-sm font-normal text-muted-foreground ml-1">{stat.suffix}</span>}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 pt-0">
            {/* Bar Chart */}
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Applications by Year</h3>
                  <PieChart className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex items-end justify-between gap-2 h-40">
                  {yearlyData.map((item, index) => (
                    <motion.div
                      key={item.year}
                      initial={{ height: 0 }}
                      animate={{ height: `${(item.value / maxBarValue) * 100}%` }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                      className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg relative group"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded px-2 py-1 text-xs font-medium text-foreground">
                        {item.value.toLocaleString()}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {yearlyData.map(item => (
                    <span key={item.year} className="text-xs text-muted-foreground">{item.year}</span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Categories Distribution</h3>
                  <PieChart className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-6">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      {categories.reduce((acc, cat, index) => {
                        const offset = acc.offset;
                        const dashArray = `${cat.value} ${100 - cat.value}`;
                        acc.elements.push(
                          <circle
                            key={cat.name}
                            cx="18"
                            cy="18"
                            r="15.9"
                            fill="none"
                            stroke={cat.color}
                            strokeWidth="3"
                            strokeDasharray={dashArray}
                            strokeDashoffset={-offset}
                          />
                        );
                        acc.offset += cat.value;
                        return acc;
                      }, { elements: [], offset: 0 }).elements}
                    </svg>
                  </div>
                  <div className="flex-1 space-y-2">
                    {categories.map(cat => (
                      <div key={cat.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                          <span className="text-sm text-foreground">{cat.name}</span>
                        </div>
                        <span className="text-sm font-medium text-foreground">{cat.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <div className="p-4 pt-0">
            <Card className="border-border/50">
              <CardContent className="p-0">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">Recent Applicants</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/30">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Score</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">University</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Faculty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row, index) => (
                        <motion.tr
                          key={row.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="border-t border-border hover:bg-muted/30"
                        >
                          <td className="px-4 py-3 text-sm text-foreground font-medium">{row.name}</td>
                          <td className="px-4 py-3 text-sm text-foreground">{row.score}</td>
                          <td className="px-4 py-3 text-sm text-foreground">{row.university}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{row.faculty}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}