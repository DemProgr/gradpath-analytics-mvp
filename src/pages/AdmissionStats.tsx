import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Minus, GraduationCap, Users, Award, BookOpen, Filter, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { useLanguage, getUniversityTranslatedName, getFacultyTranslatedName } from '@/hooks/useLanguage';

interface AdmissionStatsProps {
  isChatOpen?: boolean;
  onChatToggle?: (open: boolean) => void;
}

const AdmissionStats = ({ isChatOpen = false }: AdmissionStatsProps) => {
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('2025');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const { t, language } = useLanguage();

  // Fetch universities
  const { data: universities } = useQuery({
    queryKey: ['universities'],
    queryFn: async () => {
      return api.get<any[]>('/api/universities');
    }
  });

  // Fetch faculties based on selected university
  const { data: faculties } = useQuery({
    queryKey: ['faculties', selectedUniversity],
    queryFn: async () => {
      const url = selectedUniversity !== 'all' 
        ? `/api/faculties?universityId=${selectedUniversity}`
        : '/api/faculties';
      return api.get<any[]>(url);
    }
  });

  // Fetch admission stats
  const { data: admissionStats, isLoading } = useQuery({
    queryKey: ['admission-stats', selectedUniversity, selectedYear, selectedFaculty],
    queryFn: async () => {
      const yearParam = selectedYear !== 'all' ? `?year=${selectedYear}` : '';
      const [stats, specialties, allFaculties, universities] = await Promise.all([
        api.get<any[]>(`/api/admission-stats${yearParam}`),
        api.get<any[]>('/api/specialties'),
        api.get<any[]>('/api/faculties'),
        api.get<any[]>('/api/universities'),
      ]);

      // Create lookup maps (server uses camelCase)
      const specialtyMap = new Map(specialties.map(s => [s.id, s]));
      const facultyMap = new Map(allFaculties.map(f => [f.id, f]));
      const universityMap = new Map(universities.map(u => [u.id, u]));

      // Join data
      let joined = (stats || []).map(stat => {
        const specialty = specialtyMap.get(stat.specialtyId);
        const faculty = specialty ? facultyMap.get(specialty.facultyId) : null;
        const university = faculty ? universityMap.get(faculty.universityId) : null;
        
        return {
          ...stat,
          specialties: specialty ? {
            name: specialty.name,
            code: specialty.code,
            faculties: faculty ? {
              name: faculty.name,
              name_en: faculty.nameEn,
              name_be: faculty.nameBe,
              universities: university ? {
                id: university.id,
                short_name: university.shortName,
                short_name_en: university.shortNameEn,
                short_name_be: university.shortNameBe,
                full_name: university.fullName,
                full_name_en: university.fullNameEn,
                full_name_be: university.fullNameBe,
              } : undefined,
            } : undefined,
          } : undefined,
        };
      });

      // Filter by university and faculty
      if (selectedUniversity !== 'all') {
        joined = joined?.filter(stat => 
          stat.specialties?.faculties?.universities?.id === selectedUniversity
        );
      }
      
      if (selectedFaculty !== 'all') {
        joined = joined?.filter(stat => 
          (stat.specialties as any)?.faculties?.id === selectedFaculty || 
          faculties?.find(f => f.id === selectedFaculty && stat.specialties?.faculties?.name === f.name)
        );
      }
      
      return joined;
    }
  });

  // Get unique cities from universities
  // ⚠️ МОК-ДАННЫЕ: загружать из БД
  const cities = ["⚠️ МОК: из БД"];

  // Calculate aggregated stats
  const aggregatedStats = admissionStats?.reduce((acc, stat) => {
    acc.totalBudgetPlaces += stat.budget_places || 0;
    acc.totalPaidPlaces += stat.paid_places || 0;
    acc.totalApplications += stat.applications_count || 0;
    acc.totalEnrolled += stat.enrolled_count || 0;
    if (stat.avg_score) {
      acc.avgScores.push(Number(stat.avg_score));
    }
    if (stat.min_score) {
      acc.minScores.push(Number(stat.min_score));
    }
    return acc;
  }, {
    totalBudgetPlaces: 0,
    totalPaidPlaces: 0,
    totalApplications: 0,
    totalEnrolled: 0,
    avgScores: [] as number[],
    minScores: [] as number[]
  });

  const avgScore = aggregatedStats?.avgScores.length 
    ? (aggregatedStats.avgScores.reduce((a: number, b: number) => a + b, 0) / aggregatedStats.avgScores.length).toFixed(1)
    : t('common.noData');

  const minScore = aggregatedStats?.minScores.length
    ? Math.min(...aggregatedStats.minScores).toFixed(1)
    : t('common.noData');

  const competition = aggregatedStats && aggregatedStats.totalBudgetPlaces > 0
    ? (aggregatedStats.totalApplications / aggregatedStats.totalBudgetPlaces).toFixed(1)
    : t('common.noData');

  // Prepare chart data by grouping stats by year for comparison
  const prepareChartData = () => {
    if (!admissionStats) return [];
    
    const yearData: Record<string, any> = {};
    
    admissionStats.forEach(stat => {
      const year = stat.year.toString();
      if (!yearData[year]) {
        yearData[year] = {
          year,
          budgetPlaces: 0,
          paidPlaces: 0,
          applications: 0,
          avgScores: [] as number[],
          minScores: [] as number[]
        };
      }
      yearData[year].budgetPlaces += stat.budget_places || 0;
      yearData[year].paidPlaces += stat.paid_places || 0;
      yearData[year].applications += stat.applications_count || 0;
      if (stat.avg_score) yearData[year].avgScores.push(Number(stat.avg_score));
      if (stat.min_score) yearData[year].minScores.push(Number(stat.min_score));
    });
    
    return Object.values(yearData).map((item: any) => ({
      ...item,
      avgScore: item.avgScores.length 
        ? (item.avgScores.reduce((a: number, b: number) => a + b, 0) / item.avgScores.length).toFixed(1)
        : null,
      minScore: item.minScores.length 
        ? Math.min(...item.minScores).toFixed(1)
        : null
    })).sort((a: any, b: any) => parseInt(a.year) - parseInt(b.year));
  };

  const chartDataArray = prepareChartData();

  // ⚠️ МОК-ДАННЫЕ: загружать из БД
  const years = ["2025", "2026"];

  return (
    <div className="min-h-screen bg-background">
      <Header chatOpen={isChatOpen} />
      
      <motion.main
        animate={{
          marginRight: isChatOpen ? '450px' : '0px'
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="pt-24 pb-16 relative"
      >
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                  {t('admission.title')}
                </h1>
                <p className="text-muted-foreground">
                  {t('admission.subtitle')}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder={t('common.year')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('admission.allYears')}</SelectItem>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedUniversity} onValueChange={(v) => {
                  setSelectedUniversity(v);
                  setSelectedFaculty('all'); // Reset faculty when university changes
                }}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t('admission.university')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('admission.allUniversities')}</SelectItem>
                    {universities?.map(uni => (
                      <SelectItem key={uni.id} value={uni.id}>{getUniversityTranslatedName(uni, language)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder={t('admission.faculty')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('admission.allFaculties')}</SelectItem>
                    {faculties?.map(fac => (
                      <SelectItem key={fac.id} value={fac.id}>
                        {getFacultyTranslatedName(fac, language).length > 30 ? getFacultyTranslatedName(fac, language).substring(0, 30) + '...' : getFacultyTranslatedName(fac, language)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedUniversity !== 'all' || selectedFaculty !== 'all' || selectedYear !== 'all') && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t('admission.activeFilters')}:</span>
                {selectedYear !== 'all' && (
                  <Badge variant="secondary">{selectedYear} {t('admission.yearBadge')}</Badge>
                )}
                {selectedUniversity !== 'all' && (
                  <Badge variant="secondary">
                    {(() => {
                      const uni = universities?.find(u => u.id === selectedUniversity);
                      return uni ? getUniversityTranslatedName(uni, language) : '';
                    })()}
                  </Badge>
                )}
                {selectedFaculty !== 'all' && (
                  <Badge variant="secondary">
                    {(() => {
                      const fac = faculties?.find(f => f.id === selectedFaculty);
                      return fac ? getFacultyTranslatedName(fac, language).substring(0, 25) + '...' : '';
                    })()}
                  </Badge>
                )}
              </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('admission.budgetPlaces')}</p>
                      <p className="text-2xl font-bold">{aggregatedStats?.totalBudgetPlaces || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary/50">
                      <BookOpen className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('admission.paidPlaces')}</p>
                      <p className="text-2xl font-bold">{aggregatedStats?.totalPaidPlaces || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Award className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('admission.avgScore')}</p>
                      <p className="text-2xl font-bold">{avgScore}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <Users className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('admission.competition')}</p>
                      <p className="text-2xl font-bold">{competition}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="table" className="space-y-6">
              <TabsList>
                <TabsTrigger value="table">{t('admission.table')}</TabsTrigger>
                <TabsTrigger value="charts">{t('admission.charts')}</TabsTrigger>
              <TabsTrigger value="comparison">{t('admission.comparison')}</TabsTrigger>
              </TabsList>

              <TabsContent value="table">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('admission.detailStats')}</CardTitle>
                    <CardDescription>
                      {t('admission.detailStatsDesc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : admissionStats && admissionStats.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t('admission.specialty')}</TableHead>
                              <TableHead>{t('admission.uni')}</TableHead>
                              <TableHead className="text-center">{t('admission.year')}</TableHead>
                              <TableHead className="text-right">{t('admission.budget')}</TableHead>
                              <TableHead className="text-right">{t('admission.paid')}</TableHead>
                              <TableHead className="text-right">{t('admission.minScore')}</TableHead>
                              <TableHead className="text-right">{t('admission.avgScoreShort')}</TableHead>
                              <TableHead className="text-right">{t('admission.applications')}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {admissionStats.map((stat) => (
                              <TableRow key={stat.id}>
                                <TableCell className="font-medium max-w-[200px]">
                                  <div className="truncate" title={stat.specialties?.name}>
                                    {stat.specialties?.name || t('common.noData')}
                                  </div>
                                  {stat.specialties?.code && (
                                    <span className="text-xs text-muted-foreground">
                                      {stat.specialties.code}
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {stat.specialties?.faculties?.universities ? 
                                      getUniversityTranslatedName(stat.specialties.faculties.universities, language) : 
                                      t('common.noData')}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center">{stat.year}</TableCell>
                                <TableCell className="text-right">{stat.budget_places ?? '—'}</TableCell>
                                <TableCell className="text-right">{stat.paid_places ?? '—'}</TableCell>
                                <TableCell className="text-right">
                                  {stat.min_score ? parseFloat(String(stat.min_score)).toFixed(1) : '—'}
                                </TableCell>
                                <TableCell className="text-right">
                                  {stat.avg_score ? parseFloat(String(stat.avg_score)).toFixed(1) : '—'}
                                </TableCell>
                                <TableCell className="text-right">{stat.applications_count ?? '—'}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <p>{t('admission.noData')}</p>
                        <p className="text-sm mt-2">
                          {t('admission.noDataDesc')}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="charts">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('admission.placesDynamics')}</CardTitle>
                      <CardDescription>{t('admission.placesDynamicsDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {chartDataArray.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={chartDataArray}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="year" className="text-xs" />
                            <YAxis className="text-xs" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                              }}
                            />
                            <Legend />
                            <Bar dataKey="budgetPlaces" name={t('admission.budgetShort')} fill="hsl(var(--primary))" />
                            <Bar dataKey="paidPlaces" name={t('admission.paid')} fill="hsl(var(--muted-foreground))" />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                          {t('admission.noChartData')}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('admission.scoreDynamics')}</CardTitle>
                      <CardDescription>{t('admission.scoreDynamicsDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {chartDataArray.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={chartDataArray}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="year" className="text-xs" />
                            <YAxis domain={['auto', 'auto']} className="text-xs" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="avgScore" 
                              name={t('admission.avgScore')}
                              stroke="hsl(var(--primary))" 
                              strokeWidth={2}
                              dot={{ fill: 'hsl(var(--primary))' }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                          {t('admission.noChartData')}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('admission.minScores')}</CardTitle>
                      <CardDescription>{t('admission.minScoresDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {chartDataArray.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={chartDataArray}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="year" className="text-xs" />
                            <YAxis domain={['auto', 'auto']} className="text-xs" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="minScore" 
                              name={t('admission.minScore')}
                              stroke="hsl(var(--accent))" 
                              strokeWidth={2}
                              dot={{ fill: 'hsl(var(--accent))' }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="avgScore" 
                              name={t('admission.avgScore')}
                              stroke="hsl(var(--primary))" 
                              strokeWidth={2}
                              dot={{ fill: 'hsl(var(--primary))' }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                          {t('admission.noChartData')}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="comparison">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      {t('admission.comparisonTitle')}
                    </CardTitle>
                    <CardDescription>
                      {t('admission.comparisonDesc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {chartDataArray.length > 1 ? (
                      <div className="space-y-6">
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart data={chartDataArray}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="year" className="text-xs" />
                            <YAxis className="text-xs" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                              }}
                            />
                            <Legend />
                            <Bar dataKey="budgetPlaces" name={t('admission.budgetShort')} fill="hsl(var(--primary))" />
                            <Bar dataKey="paidPlaces" name={t('admission.paid')} fill="hsl(var(--muted-foreground))" />
                            <Bar dataKey="applications" name={t('admission.applicationsShort')} fill="hsl(var(--accent))" />
                          </BarChart>
                        </ResponsiveContainer>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {chartDataArray.map((yearData: any) => (
                            <Card key={yearData.year} className="bg-muted/30">
                              <CardContent className="pt-4">
                                <h4 className="text-lg font-bold mb-2">{yearData.year}</h4>
                                <div className="space-y-1 text-sm">
                                  <p>{t('admission.budgetShort')}: <span className="font-medium">{yearData.budgetPlaces}</span></p>
                                  <p>{t('admission.paid')}: <span className="font-medium">{yearData.paidPlaces || 0}</span></p>
                                  <p>{t('admission.avgScoreShort')}: <span className="font-medium">{yearData.avgScore || '—'}</span></p>
                                  <p>{t('admission.minScore')}: <span className="font-medium">{yearData.minScore || '—'}</span></p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                        <BarChart3 className="w-12 h-12 mb-4 opacity-50" />
                        <p>{t('admission.comparisonNeedData')}</p>
                        <p className="text-sm mt-2">{t('admission.selectAllYears')}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Data Source Notice */}
            <Card className="mt-6 bg-muted/50">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  <strong>{t('admission.dataSource')}</strong> {t('admission.dataSourceDesc')}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.main>

    </div>
  );
};

export default AdmissionStats;
