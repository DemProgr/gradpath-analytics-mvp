// ⚠️ Числовые значения обнулены — заменить на реальные данные из БД
import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, CheckCircle, XCircle, ChevronDown, ChevronUp, Award, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { api } from '@/lib/api/client';
import { 
  CT_SUBJECTS, 
  CT_REQUIREMENTS, 
  getSubjectNameById,
  type SpecialtyRequirement 
} from '@/data/ctSubjects';

interface ScoreEntry {
  subjectId: string;
  score: number;
}

interface MatchingSpecialty extends SpecialtyRequirement {
  totalScore: number;
  canApply: boolean;
  missingScore: number;
  passingScore?: number;
}

// ⚠️ МОК-ДАННЫЕ: загружать из БД
const POPULAR_SUBJECT_SETS = [
  { id: 'mock', name: '⚠️ МОК', subjects: ['⚠️ МОК', '⚠️ МОК', '⚠️ МОК'] },
];

interface PassingScoreData {
  [specialtyCode: string]: number;
}

export function ScoreCalculator() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [avgScore, setAvgScore] = useState<number>(7);
  const [subjectSearch, setSubjectSearch] = useState('');
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const [isCalculated, setIsCalculated] = useState(false);
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const [passingScores, setPassingScores] = useState<PassingScoreData>({});
  const [loadingScores, setLoadingScores] = useState(true);

  useEffect(() => {
    async function fetchPassingScores() {
      try {
        const allStats = await api.get<any[]>('/api/admission-stats?year=2025');
        const statsData = allStats?.filter(s => s.specialtyId && String(s.specialtyId).startsWith('bsu-')) || [];

        const scoresMap: PassingScoreData = {};
        statsData.forEach(stat => {
          if (stat.specialtyId && stat.minScore) {
            scoresMap[stat.specialtyId] = stat.minScore;
          }
        });
        setPassingScores(scoresMap);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoadingScores(false);
      }
    }

    fetchPassingScores();
  }, []);

  const availableSubjects = CT_SUBJECTS.filter(s => 
    s.name.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  const canAddMoreSubjects = scores.length < 3;

  const [languageError, setLanguageError] = useState<string | null>(null);

  const addSubject = (subjectId: string, fromQuickSelect = false) => {
    setLanguageError(null);
    
    if (scores.find(s => s.subjectId === subjectId)) return;
    if (scores.length >= 3) return;

    const FOREIGN_LANGUAGES = ['english', 'german', 'french', 'spanish', 'chinese'];
    const NATIVE_LANGUAGES = ['russian', 'belarusian'];

    if (subjectId === 'russian' || subjectId === 'belarusian') {
      const hasOtherLanguage = scores.find(s => s.subjectId === 'russian' || s.subjectId === 'belarusian');
      if (hasOtherLanguage) {
        setLanguageError('Нельзя сдавать русский и белорусский язык одновременно!');
        return;
      }
    }

    if (FOREIGN_LANGUAGES.includes(subjectId)) {
      const hasOtherForeign = scores.find(s => FOREIGN_LANGUAGES.includes(s.subjectId));
      if (hasOtherForeign) {
        const otherLang = CT_SUBJECTS.find(s => s.id === hasOtherForeign.subjectId);
        setLanguageError(`Можно сдать только один иностранный язык! Уже выбран: ${otherLang?.name}`);
        return;
      }
    }

    if (NATIVE_LANGUAGES.includes(subjectId)) {
      const hasOtherNative = scores.find(s => NATIVE_LANGUAGES.includes(s.subjectId));
      if (hasOtherNative) {
        const otherLang = CT_SUBJECTS.find(s => s.id === hasOtherNative.subjectId);
        setLanguageError(`Можно сдать только один государственный язык! Уже выбран: ${otherLang?.name}`);
        return;
      }
    }

    setScores([...scores, { subjectId, score: 0 }]);
    setSubjectSearch('');
    setShowAllSubjects(false);
  };

  const addSubjectSet = (subjects: string[]) => {
    const FOREIGN_LANGUAGES = ['english', 'german', 'french', 'spanish', 'chinese'];
    const NATIVE_LANGUAGES = ['russian', 'belarusian'];

    const hasRussian = subjects.includes('russian');
    const hasBelarusian = subjects.includes('belarusian');
    const currentHasRussian = scores.some(s => s.subjectId === 'russian');
    const currentHasBelarusian = scores.some(s => s.subjectId === 'belarusian');

    if (hasRussian && currentHasBelarusian) {
      setLanguageError('Нельзя сдавать русский и белорусский язык одновременно!');
      return;
    }
    if (hasBelarusian && currentHasRussian) {
      setLanguageError('Нельзя сдавать русский и белорусский язык одновременно!');
      return;
    }

    const hasForeignInSet = subjects.some(s => FOREIGN_LANGUAGES.includes(s));
    const currentHasForeign = scores.some(s => FOREIGN_LANGUAGES.includes(s.subjectId));
    if (hasForeignInSet && currentHasForeign) {
      setLanguageError('Можно сдать только один иностранный язык!');
      return;
    }

    const newEntries = subjects
      .filter(id => !scores.find(s => s.subjectId === id))
      .slice(0, 3 - scores.length)
      .map(id => ({ subjectId: id, score: 0 }));
    setScores([...scores, ...newEntries]);
    setIsCalculated(false);
  };

  const updateScore = (subjectId: string, score: number) => {
    setScores(scores.map(s => 
      s.subjectId === subjectId ? { ...s, score: Math.min(100, Math.max(0, score)) } : s
    ));
  };

  const removeSubject = (subjectId: string) => {
    setScores(scores.filter(s => s.subjectId !== subjectId));
    setIsCalculated(false);
  };

  const calculateMatches = (): MatchingSpecialty[] => {
    const userSubjects = scores.map(s => s.subjectId);
    const totalCTScore = scores.reduce((sum, s) => sum + s.score, 0);
    const avgScorePoints = avgScore * 10;
    const totalScore = totalCTScore + avgScorePoints;
    
    return CT_REQUIREMENTS
      .filter(req => {
        const required = [req.firstSubject, req.secondSubject, req.thirdSubject];
        const hasAll = required.every(subj => userSubjects.includes(subj));
        return hasAll;
      })
      .map(req => {
        const dbPassingScore = passingScores[req.specialtyId];
        const minScore = dbPassingScore || req.minTotalScore;
        const canApply = totalScore >= minScore;
        const missingScore = Math.max(0, minScore - totalScore);
        
        return {
          ...req,
          totalScore,
          canApply,
          missingScore,
          passingScore: dbPassingScore || req.minTotalScore,
        };
      })
      .sort((a, b) => {
        if (a.canApply !== b.canApply) return a.canApply ? -1 : 1;
        return b.totalScore - a.totalScore;
      });
  };

  const results = useMemo(() => calculateMatches(), [scores, avgScore, passingScores]);
  const canApply = results.filter(r => r.canApply);
  const cannotApply = results.filter(r => !r.canApply);

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => 
      prev.includes(group) 
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  const handleCalculate = () => {
    setIsCalculated(true);
    setOpenGroups(['canApply']);
  };

  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
  const totalScoreWithAvg = totalScore + (avgScore * 10);

  return (
    <Card className="overflow-hidden border-2 border-primary/10">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Calculator className="w-5 h-5 text-primary" />
          Калькулятор баллов
        </CardTitle>
        <CardDescription>
          Введите 3 предмета ЦТ/ЦЭ и средний балл аттестата
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Popular Sets */}
        {!isCalculated && (
          <div className="space-y-3">
            <p className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Популярные направления
            </p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SUBJECT_SETS.map(set => (
                <Button
                  key={set.id}
                  variant="outline"
                  size="sm"
                  onClick={() => addSubjectSet(set.subjects)}
                  className="text-xs"
                  disabled={scores.length >= 3}
                >
                  {set.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Average Score Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            Средний балл аттестата
          </label>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={avgScore}
              onChange={(e) => setAvgScore(Math.min(10, Math.max(1, parseFloat(e.target.value) || 0)))}
              className="w-24 text-center font-bold text-lg"
              min={1}
              max={10}
              step={0.1}
            />
            <div className="flex-1">
              <Progress value={(avgScore / 10) * 100} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1</span>
                <span className={avgScore >= 7 ? "text-green-500 font-medium" : ""}>7+ (обычно нужно)</span>
                <span>10</span>
              </div>
            </div>
          </div>
        </div>

        {/* Language Error */}
        {languageError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500"
          >
            {languageError}
          </motion.div>
        )}

        {/* Subjects Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-500" />
            Предметы ЦТ/ЦЭ
            <Badge variant="secondary" className="ml-auto">
              {scores.length}/3
            </Badge>
          </label>
          
          {canAddMoreSubjects ? (
            <div className="relative">
              <Input
                placeholder="Поиск предмета (например: математика, физика, биология...)"
                value={subjectSearch}
                onChange={(e) => setSubjectSearch(e.target.value)}
                onFocus={() => setShowAllSubjects(true)}
                className="w-full pr-10"
              />
              {subjectSearch && (
                <button
                  onClick={() => setSubjectSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              )}
              {(subjectSearch || showAllSubjects) && (
                <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {showAllSubjects && !subjectSearch && (
                    <button
                      onClick={() => setShowAllSubjects(false)}
                      className="absolute top-2 right-2 text-muted-foreground hover:text-foreground z-10"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                  {availableSubjects.slice(0, 10).map(subject => (
                    <button
                      key={subject.id}
                      onClick={() => addSubject(subject.id)}
                      disabled={scores.length >= 3}
                      className="w-full px-3 py-2.5 text-left text-sm hover:bg-accent transition-colors disabled:opacity-50"
                    >
                      {subject.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-2">
              Выбрано 3 предмета
            </p>
          )}

          {/* Selected Subjects */}
          <div className="space-y-2">
            <AnimatePresence>
              {scores.map((entry, idx) => {
                const subject = CT_SUBJECTS.find(s => s.id === entry.subjectId);
                return (
                  <motion.div
                    key={entry.subjectId}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 bg-muted/50 rounded-lg p-2"
                  >
                    <Badge variant="outline" className="w-8 justify-center">
                      {idx + 1}
                    </Badge>
                    <span className="flex-1 text-sm font-medium">
                      {subject?.name}
                    </span>
                    <Input
                      type="number"
                      value={entry.score}
                      onChange={(e) => updateScore(entry.subjectId, parseInt(e.target.value) || 0)}
                      className="w-20 text-center"
                      min={0}
                      max={100}
                      placeholder="балл"
                    />
                    <span className="text-xs text-muted-foreground w-8">/100</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSubject(entry.subjectId)}
                      className="text-destructive hover:text-destructive h-8 w-8"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {scores.length < 3 && (
              <p className="text-sm text-muted-foreground text-center py-2">
                Добавьте ещё {3 - scores.length} предмета
              </p>
            )}

            {scores.length === 3 && (
              <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Сумма баллов ЦТ:</span>
                    <span className="text-xl font-bold">{totalScore}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Балл аттестата × 10:</span>
                    <span className="text-xl font-bold text-amber-600">+{avgScore * 10}</span>
                  </div>
                  <div className="border-t pt-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Итого:</span>
                    <span className="text-2xl font-bold text-primary">{totalScoreWithAvg}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Calculate Button */}
        <Button 
          onClick={handleCalculate}
          disabled={scores.length !== 3}
          className="w-full"
          size="lg"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Рассчитать шансы
        </Button>

        {/* Validation Message */}
        {scores.length !== 3 && (
          <p className="text-xs text-center text-muted-foreground">
            ✨ Выберите ровно 3 предмета ЦТ/ЦЭ для расчёта
          </p>
        )}

        {/* Results */}
        {isCalculated && scores.length === 3 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {results.length === 0 && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-center">
                <p className="text-sm text-amber-600 font-medium mb-2">
                  Нет специальностей с выбранными предметами
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  Выбраны предметы: {scores.map(s => s.subjectId).join(', ')}
                </p>
                <p className="text-xs text-muted-foreground">
                  Доступно специальностей всего: {CT_REQUIREMENTS.length}
                </p>
              </div>
            )}
            {/* Summary Stats */}
            {results.length > 0 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-green-500/10 rounded-lg">
                    <p className="text-2xl font-bold text-green-500">{canApply.length}</p>
                    <p className="text-xs text-muted-foreground">Вы проходите</p>
                  </div>
                  <div className="text-center p-3 bg-red-500/10 rounded-lg">
                    <p className="text-2xl font-bold text-red-500">{cannotApply.length}</p>
                    <p className="text-xs text-muted-foreground">Не хватает баллов</p>
                  </div>
                </div>
                {loadingScores && (
                  <p className="text-xs text-center text-muted-foreground">
                    Загрузка актуальных проходных баллов...
                  </p>
                )}
                {!loadingScores && Object.keys(passingScores).length > 0 && (
                  <p className="text-xs text-center text-muted-foreground">
                    * Проходные баллы 2025 года (БГУ)
                  </p>
                )}
              </>
            )}

            {/* Can Apply */}
            {canApply.length > 0 && (
              <Collapsible 
                open={openGroups.includes('canApply')}
                onOpenChange={() => toggleGroup('canApply')}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-green-500/10 rounded-lg hover:bg-green-500/20 transition-colors">
                  <span className="font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Вы проходите ({canApply.length})
                  </span>
                  {openGroups.includes('canApply') ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 space-y-2">
                  {canApply.slice(0, 15).map((result, idx) => (
                    <div 
                      key={result.specialtyName + result.universityShortName}
                      className="p-3 border border-green-500/20 rounded-lg bg-card hover:bg-accent/20 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{result.specialtyName}</p>
                          <p className="text-xs text-muted-foreground">
                            {result.universityShortName}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500">
                          {result.totalScore} баллов
                        </Badge>
                      </div>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>{getSubjectNameById(result.firstSubject)}</span>
                        <span>•</span>
                        <span>{getSubjectNameById(result.secondSubject)}</span>
                        <span>•</span>
                        <span>{getSubjectNameById(result.thirdSubject)}</span>
                      </div>
                    </div>
                  ))}
                  {canApply.length > 15 && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      ... и ещё {canApply.length - 15} специальностей
                    </p>
                  )}
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Cannot Apply */}
            {cannotApply.length > 0 && (
              <Collapsible 
                open={openGroups.includes('cannotApply')}
                onOpenChange={() => toggleGroup('cannotApply')}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors">
                  <span className="font-medium flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    Не хватает баллов ({cannotApply.length})
                  </span>
                  {openGroups.includes('cannotApply') ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 space-y-2">
                  {cannotApply.slice(0, 10).map((result, idx) => (
                    <div 
                      key={result.specialtyName + result.universityShortName}
                      className="p-3 border border-red-500/20 rounded-lg bg-card"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{result.specialtyName}</p>
                          <p className="text-xs text-muted-foreground">
                            {result.universityShortName}
                          </p>
                        </div>
                        <Badge variant="destructive">
                          нужно {result.passingScore}
                        </Badge>
                      </div>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>{getSubjectNameById(result.firstSubject)}</span>
                        <span>•</span>
                        <span>{getSubjectNameById(result.secondSubject)}</span>
                        <span>•</span>
                        <span>{getSubjectNameById(result.thirdSubject)}</span>
                      </div>
                    </div>
                  ))}
                  {cannotApply.length > 10 && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      ... и ещё {cannotApply.length - 10} специальностей
                    </p>
                  )}
                </CollapsibleContent>
              </Collapsible>
            )}

            <p className="text-xs text-muted-foreground text-center">
              * Минимальный балл указан для ознакомления. Реальный проходной балл может быть выше.
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
