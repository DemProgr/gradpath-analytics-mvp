import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, GraduationCap, HelpCircle, CheckCircle, XCircle, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CT_SUBJECTS, getSubjectNameById } from '@/data/ctSubjects';
import { supabase } from '@/integrations/supabase/client';
import { getExamRequirementsByFaculty } from '@/data/examRequirementsByFaculty';

interface SpecialtyWithFaculty {
  id: string;
  name: string;
  code: string;
  facultyName: string;
  university: string;
  hasBudget: boolean;
  hasPaid: boolean;
}

interface UserExam {
  subjectId: string;
  score: number;
}

interface MatchingSpecialty {
  specialty: SpecialtyWithFaculty;
  passingScore2025: number;
  canApply: boolean;
  missingScore: number;
  userScore: number;
  exams: string[];
}

const EXAM_ID_MAP: Record<string, string> = {
  'math': 'math',
  'physics': 'physics',
  'chemistry': 'chemistry',
  'biology': 'biology',
  'geography': 'geography',
  'world_history': 'world_history',
  'social_science': 'social_science',
  'english': 'english',
};

export function SimplePassingScoreCalculator() {
  const [userExams, setUserExams] = useState<UserExam[]>([]);
  const [avgScore, setAvgScore] = useState<number>(7);
  const [specialties, setSpecialties] = useState<SpecialtyWithFaculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [budgetScores, setBudgetScores] = useState<Record<string, number>>({});
  const [paidScores, setPaidScores] = useState<Record<string, number>>({});
  const [showExamSelector, setShowExamSelector] = useState(false);
  const [isPaidForm, setIsPaidForm] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const { data: facultiesData } = await supabase
          .from('faculties')
          .select('id, name, university_id')
          .limit(500);

        const { data: institutesData } = await supabase
          .from('institutes')
          .select('id, name, university_id')
          .limit(500);

        const { data: specialtiesData } = await supabase
          .from('specialties')
          .select('id, name, code, faculty_id, institute_id')
          .limit(1000);

        const { data: universitiesData } = await supabase
          .from('universities')
          .select('id, short_name')
          .limit(100);

        const facultyMap = new Map<string, { name: string; university: string }>();
        const instituteMap = new Map<string, { name: string; university: string }>();
        
        facultiesData?.forEach(f => {
          const uni = universitiesData?.find(u => u.id === f.university_id);
          facultyMap.set(f.id, { name: f.name, university: uni?.short_name || '' });
        });
        
        institutesData?.forEach(i => {
          const uni = universitiesData?.find(u => u.id === i.university_id);
          instituteMap.set(i.id, { name: i.name, university: uni?.short_name || '' });
        });

        // Get stats first to determine budget/paid availability
        let statsData: any[] = [];
        try {
          const result = await supabase
            .from('admission_stats')
            .select('min_score, paid_min_score, specialty_id')
            .eq('year', 2025);
          statsData = result.data || [];
        } catch (e) {
          // Try without paid_min_score if column doesn't exist
          try {
            const result = await supabase
              .from('admission_stats')
              .select('min_score, specialty_id')
              .eq('year', 2025);
            statsData = result.data || [];
          } catch (e2) {
            statsData = [];
          }
        }

        // Build scores maps
        const budgetScoresMap: Record<string, number> = {};
        const paidScoresMap: Record<string, number> = {};
        const hasBudgetMap: Record<string, boolean> = {};
        const hasPaidMap: Record<string, boolean> = {};
        
        statsData.forEach((stat: any) => {
          if (stat.specialty_id) {
            if (stat.min_score !== null && stat.min_score !== undefined) {
              budgetScoresMap[stat.specialty_id] = Number(stat.min_score);
              hasBudgetMap[stat.specialty_id] = true;
            }
            if (stat.paid_min_score !== null && stat.paid_min_score !== undefined) {
              paidScoresMap[stat.specialty_id] = Number(stat.paid_min_score);
              hasPaidMap[stat.specialty_id] = true;
            }
          }
        });

        setBudgetScores(budgetScoresMap);
        setPaidScores(paidScoresMap);

        // Now build specialties with correct hasBudget/hasPaid
        const enrichedSpecialties: SpecialtyWithFaculty[] = (specialtiesData || [])
          .filter(s => s.faculty_id || s.institute_id)
          .map(s => {
            const faculty = s.faculty_id ? facultyMap.get(s.faculty_id) : null;
            const institute = s.institute_id ? instituteMap.get(s.institute_id) : null;
            const parent = faculty || institute;
            
            // Determine hasBudget/hasPaid based on actual data from DB
            const hasBudget = hasBudgetMap[s.id] === true;
            const hasPaid = hasPaidMap[s.id] === true;
            
            // Special handling for Институт бизнеса БГУ - only paid
            const isBusinessInstitute = parent?.name?.includes('Институт бизнеса');
            
            return {
              id: s.id,
              name: s.name,
              code: s.code || '',
              facultyName: parent?.name || '',
              university: parent?.university || '',
              hasBudget: isBusinessInstitute ? false : (hasBudget || (!hasPaid && !isBusinessInstitute)),
              hasPaid: hasPaid || isBusinessInstitute || !hasBudget
            };
          })
          .filter(s => s.facultyName && (s.university === 'БГУ' || s.university === 'БГУИР'));

        setSpecialties(enrichedSpecialties);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  const addExam = (subjectId: string) => {
    if (userExams.find(e => e.subjectId === subjectId)) return;
    if (userExams.length >= 3) return;
    setUserExams([...userExams, { subjectId, score: 0 }]);
    setShowExamSelector(false);
  };

  const removeExam = (subjectId: string) => {
    setUserExams(userExams.filter(e => e.subjectId !== subjectId));
  };

  const updateExamScore = (subjectId: string, score: number) => {
    setUserExams(userExams.map(e => 
      e.subjectId === subjectId ? { ...e, score: Math.min(100, Math.max(0, score)) } : e
    ));
  };

  const totalCTScore = userExams.reduce((sum, e) => sum + e.score, 0);
  const totalScore = totalCTScore + (avgScore * 10);

  const matchingSpecialties = useMemo((): MatchingSpecialty[] => {
    if (userExams.length !== 3 || totalScore === 0) return [];

    const userExamIds = userExams.map(e => e.subjectId);
    const userExamSet = new Set(userExamIds);

    const results = specialties
      .map(spec => {
        const examReq = getExamRequirementsByFaculty(spec.facultyName);
        if (!examReq) return null;

        const requiredExams = [
          EXAM_ID_MAP[examReq.firstExam] || examReq.firstExam,
          EXAM_ID_MAP[examReq.secondExam] || examReq.secondExam,
          EXAM_ID_MAP[examReq.thirdExam] || examReq.thirdExam
        ].filter(Boolean);

        if (requiredExams.length === 0) return null;

        const matches = requiredExams.every(reqExam => {
          if (!reqExam) return false;
          if (userExamSet.has(reqExam)) return true;
          if (reqExam === 'russian' && userExamSet.has('belarusian')) return true;
          if (reqExam === 'belarusian' && userExamSet.has('russian')) return true;
          return false;
        });

        if (!matches) return null;

        // Choose score based on form type
        const currentScores = isPaidForm ? paidScores : budgetScores;
        const hasForm = isPaidForm ? spec.hasPaid : spec.hasBudget;
        
        if (!hasForm) return null;

        const passingScore = currentScores[spec.id] || (isPaidForm ? 200 : 250);
        const canApply = totalScore >= passingScore;
        const missingScore = Math.max(0, passingScore - totalScore);

        return {
          specialty: spec,
          passingScore2025: passingScore,
          canApply,
          missingScore,
          userScore: totalScore,
          exams: requiredExams
        };
      })
      .filter((item): item is MatchingSpecialty => item !== null);

    return results.sort((a, b) => {
      if (a.canApply !== b.canApply) return a.canApply ? -1 : 1;
      return b.passingScore2025 - a.passingScore2025;
    });
  }, [userExams, totalScore, specialties, budgetScores, paidScores, isPaidForm]);

  const availableExams = CT_SUBJECTS.filter(
    s => !userExams.find(e => e.subjectId === s.id)
  );

  const canApplyList = matchingSpecialties.filter(s => s.canApply);
  const cannotApplyList = matchingSpecialties.filter(s => !s.canApply);

  return (
    <section className="py-16 bg-card">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Calculator className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-display font-bold text-foreground">
              Калькулятор поступления
            </h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2 gap-2">
                  <HelpCircle className="w-4 h-4" />
                  Как рассчитать балл?
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Как рассчитать проходной балл</DialogTitle>
                  <DialogDescription>
                    Как формируется сумма баллов для поступления в вузы Беларуси
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Формула расчёта</h4>
                    <p className="text-muted-foreground mb-3">
                      Сумма баллов = Баллы ЦТ (до 300) + Балл аттестата × 10 (до 100)
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Баллы за 3 предмета ЦТ:</span>
                        <span className="font-semibold">от 0 до 300</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Средний балл аттестата × 10:</span>
                        <span className="font-semibold">от 40 до 100</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Итого:</span>
                        <span>от 40 до 400</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Пример расчёта</h4>
                    <div className="p-3 bg-muted rounded-lg space-y-1 text-xs">
                      <p>Математика: <span className="font-semibold">85</span> баллов</p>
                      <p>Русский язык: <span className="font-semibold">78</span> баллов</p>
                      <p>Физика: <span className="font-semibold">92</span> баллов</p>
                      <p>Сумма ЦТ: <span className="font-semibold">255</span></p>
                      <p>Средний балл аттестата: <span className="font-semibold">8.5</span></p>
                      <p>Балл аттестата × 10: <span className="font-semibold">85</span></p>
                      <p className="border-t pt-1 font-semibold">Итого: 255 + 85 = <span className="text-primary">340 баллов</span></p>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-xs text-blue-600">
                      <strong>Важно:</strong> Проходные баллы указаны за 2025 год. На популярные специальности (ИТ, медицина) баллы могут быть выше среднего.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Выберите предметы ЦТ, введите баллы и узнайте шансы на поступление в БГУ и БГУИР.
          </p>
          {specialties.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {specialties.length} специальностей • Скоро: все вузы Беларуси
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Ваши экзамены и баллы</CardTitle>
                <CardDescription>Выберите 3 предмета ЦТ и введите баллы</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Budget/Paid Toggle */}
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Форма обучения:</span>
                    <Badge variant={isPaidForm ? "secondary" : "default"}>
                      {isPaidForm ? "Платная" : "Бюджет"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Бюджет</span>
                    <Switch
                      checked={isPaidForm}
                      onCheckedChange={setIsPaidForm}
                    />
                    <span className="text-xs text-muted-foreground">Платно</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium">Предметы ЦТ</label>
                  
                  {userExams.length < 3 && (
                    <div className="relative">
                      <Button
                        variant="outline"
                        onClick={() => setShowExamSelector(!showExamSelector)}
                        className="w-full justify-start gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Добавить предмет
                      </Button>
                      
                      {showExamSelector && (
                        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {availableExams.map(subject => (
                            <button
                              key={subject.id}
                              onClick={() => addExam(subject.id)}
                              className="w-full px-3 py-2.5 text-left text-sm hover:bg-accent transition-colors"
                            >
                              {subject.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    {userExams.map((exam, idx) => {
                      const subject = CT_SUBJECTS.find(s => s.id === exam.subjectId);
                      return (
                        <div key={exam.subjectId} className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
                          <Badge variant="outline" className="w-8 justify-center">
                            {idx + 1}
                          </Badge>
                          <span className="flex-1 text-sm font-medium">
                            {subject?.name}
                          </span>
                          <Input
                            type="number"
                            value={exam.score || ''}
                            onChange={(e) => updateExamScore(exam.subjectId, parseInt(e.target.value) || 0)}
                            className="w-20 text-center"
                            min={0}
                            max={100}
                            placeholder="балл"
                          />
                          <span className="text-xs text-muted-foreground w-8">/100</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeExam(exam.subjectId)}
                            className="text-destructive hover:text-destructive h-8 w-8"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Средний балл аттестата</label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      value={avgScore}
                      onChange={(e) => setAvgScore(Math.min(10, Math.max(1, parseFloat(e.target.value) || 0)))}
                      className="w-24 text-center font-bold"
                      min={1}
                      max={10}
                      step={0.1}
                    />
                    <span className="text-muted-foreground">× 10 = <span className="font-semibold">{Math.round(avgScore * 10)}</span></span>
                  </div>
                </div>

                {userExams.length === 3 && (
                  <div className="p-4 bg-primary/10 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Сумма ЦТ:</span>
                      <span className="font-semibold">{totalCTScore}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Балл аттестата × 10:</span>
                      <span className="font-semibold">+{Math.round(avgScore * 10)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-medium">Итого:</span>
                      <span className="text-2xl font-bold text-primary">{totalScore}</span>
                    </div>
                  </div>
                )}

                {userExams.length !== 3 && (
                  <p className="text-xs text-center text-muted-foreground">
                    Выберите {3 - userExams.length} предмета(ов) ЦТ
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {loading ? (
              <Card className="h-full flex items-center justify-center min-h-[300px]">
                <div className="text-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Загрузка данных...</p>
                </div>
              </Card>
            ) : userExams.length === 3 ? (
              <div className="space-y-4">
                {matchingSpecialties.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-muted-foreground">
                        Нет специальностей с таким набором предметов для {isPaidForm ? 'платной' : 'бюджетной'} формы обучения.
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Выбраны: {userExams.map(e => getSubjectNameById(e.subjectId)).join(', ')}
                      </p>
                      {specialties.length === 0 && (
                        <p className="text-xs text-red-500 mt-2">
                          Не удалось загрузить данные о специальностях
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-green-500/10 rounded-lg">
                        <p className="text-2xl font-bold text-green-500">{canApplyList.length}</p>
                        <p className="text-xs text-muted-foreground">Вы проходите</p>
                      </div>
                      <div className="text-center p-3 bg-red-500/10 rounded-lg">
                        <p className="text-2xl font-bold text-red-500">{cannotApplyList.length}</p>
                        <p className="text-xs text-muted-foreground">Не хватает баллов</p>
                      </div>
                    </div>

                    {canApplyList.length > 0 && (
                      <Card className="border-2 border-green-500/30">
                        <CardHeader className="bg-green-500/10 py-3">
                          <CardTitle className="flex items-center gap-2 text-green-600 text-lg">
                            <CheckCircle className="w-5 h-5" />
                            Вы проходите ({canApplyList.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3 max-h-[350px] overflow-y-auto">
                          {canApplyList.map((spec, idx) => (
                            <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-semibold">{spec.specialty.name}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">{spec.specialty.university}</Badge>
                                    <Badge variant={isPaidForm ? "secondary" : "outline"} className="text-xs">
                                      {isPaidForm ? "Платно" : "Бюджет"}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">{spec.specialty.facultyName}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500">
                                    {spec.userScore}
                                  </Badge>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    мин. {spec.passingScore2025}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    {cannotApplyList.length > 0 && (
                      <Card className="border-2 border-red-500/30">
                        <CardHeader className="bg-red-500/10 py-3">
                          <CardTitle className="flex items-center gap-2 text-red-600 text-lg">
                            <XCircle className="w-5 h-5" />
                            Не хватает баллов ({cannotApplyList.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3 max-h-[250px] overflow-y-auto">
                          {cannotApplyList.slice(0, 20).map((spec, idx) => (
                            <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-semibold">{spec.specialty.name}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">{spec.specialty.university}</Badge>
                                    <Badge variant={isPaidForm ? "secondary" : "outline"} className="text-xs">
                                      {isPaidForm ? "Платно" : "Бюджет"}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">{spec.specialty.facultyName}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge variant="destructive" className="text-xs">
                                    -{spec.missingScore}
                                  </Badge>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    мин. {spec.passingScore2025}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}

                <p className="text-xs text-muted-foreground text-center">
                  * Проходные баллы 2025 года из базы данных
                </p>
              </div>
            ) : (
              <Card className="h-full flex items-center justify-center min-h-[300px]">
                <div className="text-center p-8">
                  <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Выберите 3 предмета ЦТ и введите баллы
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
