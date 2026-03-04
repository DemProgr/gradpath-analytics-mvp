import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, GraduationCap, TrendingUp, AlertCircle, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PassingScore {
  university: string;
  specialty: string;
  passingScore2024: number;
  passingScore2023: number;
  budgetPlaces: number;
  totalPlaces: number;
}

const passingScoresData: PassingScore[] = [
  { university: 'БГУ', specialty: 'Прикладная математика', passingScore2024: 376, passingScore2023: 358, budgetPlaces: 25, totalPlaces: 60 },
  { university: 'БГУ', specialty: 'Экономика', passingScore2024: 342, passingScore2023: 328, budgetPlaces: 30, totalPlaces: 100 },
  { university: 'БГУ', specialty: 'Право', passingScore2024: 389, passingScore2023: 372, budgetPlaces: 20, totalPlaces: 80 },
  { university: 'БГУИР', specialty: 'Программная инженерия', passingScore2024: 365, passingScore2023: 348, budgetPlaces: 40, totalPlaces: 120 },
  { university: 'БГУИР', specialty: 'Кибербезопасность', passingScore2024: 358, passingScore2023: 341, budgetPlaces: 25, totalPlaces: 75 },
  { university: 'БНТУ', specialty: 'Машиностроение', passingScore2024: 298, passingScore2023: 285, budgetPlaces: 50, totalPlaces: 150 },
  { university: 'БНТУ', specialty: 'Строительство', passingScore2024: 312, passingScore2023: 298, budgetPlaces: 45, totalPlaces: 130 },
  { university: 'БГМУ', specialty: 'Лечебное дело', passingScore2024: 412, passingScore2023: 395, budgetPlaces: 100, totalPlaces: 250 },
  { university: 'БГМУ', specialty: 'Стоматология', passingScore2024: 425, passingScore2023: 408, budgetPlaces: 30, totalPlaces: 75 },
  { university: 'БГПУ', specialty: 'Педагогика', passingScore2024: 278, passingScore2023: 265, budgetPlaces: 60, totalPlaces: 200 },
  { university: 'БГЭУ', specialty: 'Маркетинг', passingScore2024: 328, passingScore2023: 315, budgetPlaces: 35, totalPlaces: 110 },
  { university: 'БГЭУ', specialty: 'Финансы и кредит', passingScore2024: 345, passingScore2023: 332, budgetPlaces: 40, totalPlaces: 90 },
];

interface AdmissionChancesCalculatorProps {
  className?: string;
}

export function AdmissionChancesCalculator({ className }: AdmissionChancesCalculatorProps) {
  const [selectedUniversity, setSelectedUniversity] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [ctMath, setCtMath] = useState<number>(70);
  const [ctRussian, setCtRussian] = useState<number>(70);
  const [ctBelarusian, setCtBelarusian] = useState<number>(70);
  const [ctForeignLang, setCtForeignLang] = useState<number>(0);
  const [gpa, setGpa] = useState<number>(8.5);
  const [showResults, setShowResults] = useState(false);

  const universities = [...new Set(passingScoresData.map(p => p.university))];
  
  const specialties = useMemo(() => {
    if (!selectedUniversity) return [];
    return passingScoresData
      .filter(p => p.university === selectedUniversity)
      .map(p => p.specialty);
  }, [selectedUniversity]);

  const currentScore = useMemo(() => {
    const exams = [ctMath, ctRussian, ctBelarusian].filter(e => e > 0);
    return exams.reduce((a, b) => a + b, 0) + gpa * 10;
  }, [ctMath, ctRussian, ctBelarusian, gpa]);

  const chances = useMemo(() => {
    if (!selectedSpecialty) return null;
    
    const data = passingScoresData.find(
      p => p.university === selectedUniversity && p.specialty === selectedSpecialty
    );
    
    if (!data) return null;
    
    const scoreDiff = currentScore - data.passingScore2024;
    const budgetChance = Math.min(100, Math.max(0, 50 + (scoreDiff * 2)));
    const totalChance = Math.min(100, Math.max(0, 70 + (scoreDiff * 1.5)));
    
    return {
      passingScore: data.passingScore2024,
      passingScore2023: data.passingScore2023,
      budgetChance: Math.round(budgetChance),
      totalChance: Math.round(totalChance),
      budgetPlaces: data.budgetPlaces,
      totalPlaces: data.totalPlaces,
      trend: data.passingScore2024 > data.passingScore2023 ? 'up' : 'down',
    };
  }, [selectedSpecialty, selectedUniversity, currentScore]);

  const handleAnalyze = () => {
    setShowResults(true);
  };

  const getChanceLevel = (chance: number) => {
    if (chance >= 70) return { label: 'Высокие шансы', color: 'text-green-500', Icon: CheckCircle };
    if (chance >= 40) return { label: 'Средние шансы', color: 'text-yellow-500', Icon: AlertCircle };
    return { label: 'Низкие шансы', color: 'text-red-500', Icon: XCircle };
  };

  return (
    <section className={cn("py-16 bg-card", className)}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-display font-bold text-foreground">
              Калькулятор шансов поступления
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Введите свои баллы ЦТ и средний балл аттестата, чтобы узнать вероятность поступления 
            на выбранную специальность в белорусские университеты.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Ваши данные</CardTitle>
                <CardDescription>Введите баллы ЦТ и средний балл</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Университет</Label>
                    <Select value={selectedUniversity} onValueChange={(v) => { setSelectedUniversity(v); setSelectedSpecialty(''); }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите вуз" />
                      </SelectTrigger>
                      <SelectContent>
                        {universities.map(u => (
                          <SelectItem key={u} value={u}>{u}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Специальность</Label>
                    <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty} disabled={!selectedUniversity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите специальность" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>Математика (ЦТ)</Label>
                      <span className="font-semibold text-primary">{ctMath}</span>
                    </div>
                    <Slider value={[ctMath]} onValueChange={v => setCtMath(v[0])} min={0} max={100} step={1} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>Русский/Белорусский язык (ЦТ)</Label>
                      <span className="font-semibold text-primary">{ctRussian}</span>
                    </div>
                    <Slider value={[ctRussian]} onValueChange={v => setCtRussian(v[0])} min={0} max={100} step={1} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>Второй язык (ЦТ)</Label>
                      <span className="font-semibold text-primary">{ctBelarusian}</span>
                    </div>
                    <Slider value={[ctBelarusian]} onValueChange={v => setCtBelarusian(v[0])} min={0} max={100} step={1} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>Иностранный язык (ЦТ, опционально)</Label>
                      <span className="font-semibold text-primary">{ctForeignLang}</span>
                    </div>
                    <Slider value={[ctForeignLang]} onValueChange={v => setCtForeignLang(v[0])} min={0} max={100} step={1} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>Средний балл аттестата</Label>
                      <span className="font-semibold text-primary">{gpa.toFixed(1)}</span>
                    </div>
                    <Slider value={[gpa]} onValueChange={v => setGpa(v[0])} min={4} max={10} step={0.1} />
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-lg">
                  <span className="text-muted-foreground">Ваш суммарный балл:</span>
                  <span className="text-2xl font-bold text-primary">{currentScore}</span>
                </div>

                <Button onClick={handleAnalyze} className="w-full" disabled={!selectedSpecialty}>
                  Рассчитать шансы
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {showResults && chances ? (
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Результаты
                  </CardTitle>
                  <CardDescription>
                    {selectedUniversity} • {selectedSpecialty}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-500/10 rounded-lg">
                      <p className="text-3xl font-bold text-green-500">{chances.budgetChance}%</p>
                      <p className="text-sm text-muted-foreground">на бюджет</p>
                    </div>
                    <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                      <p className="text-3xl font-bold text-blue-500">{chances.totalChance}%</p>
                      <p className="text-sm text-muted-foreground">общая</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Проходной балл 2024:</span>
                      <span className="font-semibold">{chances.passingScore}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Проходной балл 2023:</span>
                      <span className="font-semibold">{chances.passingScore2023}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ваш балл:</span>
                      <span className="font-semibold">{currentScore}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Бюджетных мест:</span>
                      <span className="font-semibold">{chances.budgetPlaces}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Всего мест:</span>
                      <span className="font-semibold">{chances.totalPlaces}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-accent/30 rounded-lg">
                    <div className="flex items-start gap-2">
                      {(() => {
                        const level = getChanceLevel(chances.budgetChance);
                        const Icon = level.Icon;
                        return <Icon className={cn("w-5 h-5 mt-0.5", level.color)} />;
                      })()}
                      <div>
                        <p className="font-semibold">{getChanceLevel(chances.budgetChance).label}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {currentScore >= chances.passingScore 
                            ? `Вы превышаете проходной балл на ${currentScore - chances.passingScore} ${currentScore - chances.passingScore === 1 ? 'балл' : 'баллов'}. Хорошие шансы!`
                            : `Вам нужно набрать еще ${chances.passingScore - currentScore} ${chances.passingScore - currentScore === 1 ? 'балл' : 'баллов'}`
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                      {chances.trend === 'up' ? '↑' : '↓'} Проходной изменился на {Math.abs(chances.passingScore - chances.passingScore2023)}
                    </Badge>
                    {chances.budgetChance >= 60 && (
                      <Badge className="bg-green-500">Рекомендуем подавать</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <div className="text-center p-8">
                  <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Выберите университет и специальность,<br />введите ваши баллы и нажмите "Рассчитать"
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
