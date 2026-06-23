import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '@/lib/api/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, DollarSign, Users, Building2, Target, TrendingUp } from 'lucide-react';

interface MilestoneStat {
  milestone: string;
  total: number;
  employment_rate: string;
  avg_salary: string;
  in_specialty_rate: string;
}

interface CompanyStat {
  company: string;
  count: number;
}

interface UniversityStat {
  university_id: string;
  university_name: string;
  total_responses: number;
  employment_rate: string;
  avg_salary: string;
}

interface StatsResponse {
  totalSurveys: number;
  byMilestone: MilestoneStat[];
  topCompanies: CompanyStat[];
  byUniversity: UniversityStat[];
  bySpecialty: any[];
}

function MilestoneLabel({ milestone }: { milestone: string }) {
  const labels: Record<string, string> = {
    '6months': 'Через 6 месяцев',
    '12months': 'Через 12 месяцев',
    '2years': 'Через 2 года',
    '4years': 'Через 4 года',
  };
  return <>{labels[milestone] || milestone}</>;
}

export function GraduateStats() {
  const { data, isLoading } = useQuery<StatsResponse>({
    queryKey: ['survey-stats'],
    queryFn: () => api.get<StatsResponse>('/api/surveys/stats'),
  });

  if (isLoading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-10 w-64 mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-xl" />)}
          </div>
        </div>
      </section>
    );
  }

  if (!data || data.totalSurveys === 0) return null;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold">Что говорят выпускники</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Данные собраны на основе опросов выпускников белорусских вузов.
            {data.totalSurveys > 0 && (
              <span> В опросе участвовало <strong>{data.totalSurveys}</strong> {data.totalSurveys === 1 ? 'выпускник' : 'выпускников'}.</span>
            )}
          </p>
        </motion.div>

        {data.byMilestone.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {data.byMilestone.map((ms, i) => (
              <motion.div
                key={ms.milestone}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="text-xs">
                        <MilestoneLabel milestone={ms.milestone} />
                      </Badge>
                      <span className="text-xs text-muted-foreground">{ms.total} {ms.total === 1 ? 'ответ' : 'ответов'}</span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Briefcase className="w-4 h-4" />
                          Трудоустроены
                        </div>
                        <p className="text-2xl font-bold text-green-600">{ms.employment_rate}%</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <DollarSign className="w-4 h-4" />
                          Средняя зарплата
                        </div>
                        <p className="text-2xl font-bold">{Number(ms.avg_salary).toLocaleString()} BYN</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Target className="w-4 h-4" />
                          Работают по специальности
                        </div>
                        <p className="text-2xl font-bold text-blue-600">{ms.in_specialty_rate}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {data.byUniversity.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">По университетам</h3>
                  </div>
                  <div className="space-y-3">
                    {data.byUniversity.slice(0, 10).map((u) => (
                      <div key={u.university_id} className="flex items-center justify-between text-sm">
                        <span className="truncate max-w-[200px]">{u.university_name}</span>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-green-600 font-medium">{u.employment_rate}%</span>
                          <span className="text-muted-foreground">{Number(u.avg_salary).toLocaleString()} BYN</span>
                          <span className="text-muted-foreground">({u.total_responses})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {data.topCompanies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Популярные работодатели</h3>
                  </div>
                  <div className="space-y-3">
                    {data.topCompanies.map((c, i) => (
                      <div key={c.company} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span className="text-muted-foreground w-5 text-right">{i + 1}.</span>
                          {c.company}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {c.count} {c.count === 1 ? 'выпускник' : 'выпускников'}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
