import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ArrowRight, ArrowLeft, Check, Sparkles, RefreshCw, Bookmark, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    value: string;
    label: string;
    category: 'tech' | 'creative' | 'social' | 'analytical' | 'practical' | 'business';
    weights: Record<string, number>;
  }[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Какой тип задач вам интереснее всего?',
    options: [
      { value: 'code', label: 'Программирование и решение технических задач', category: 'tech', weights: { it: 3, engineering: 2, science: 1 } },
      { value: 'design', label: 'Создание визуальных проектов и дизайн', category: 'creative', weights: { design: 3, media: 2, architecture: 1 } },
      { value: 'help', label: 'Помощь людям и общение', category: 'social', weights: { medicine: 2, education: 3, social: 2 } },
      { value: 'analyze', label: 'Анализ данных и исследование', category: 'analytical', weights: { science: 3, finance: 2, research: 2 } },
      { value: 'create', label: 'Создание нового, изобретения', category: 'practical', weights: { engineering: 3, science: 1, agriculture: 2 } },
      { value: 'lead', label: 'Управление проектами и командами', category: 'business', weights: { management: 3, finance: 2, law: 1 } },
    ],
  },
  {
    id: 2,
    question: 'Какие предметы вам давались лучше всего в школе?',
    options: [
      { value: 'math', label: 'Математика и информатика', category: 'tech', weights: { it: 3, engineering: 2, finance: 2 } },
      { value: 'literature', label: 'Русский/Белорусский язык, литература', category: 'creative', weights: { education: 2, media: 2, law: 1 } },
      { value: 'biology', label: 'Биология и химия', category: 'social', weights: { medicine: 3, pharmacy: 2, agriculture: 1 } },
      { value: 'physics', label: 'Физика', category: 'analytical', weights: { engineering: 3, it: 2, science: 2 } },
      { value: 'history', label: 'История и обществознание', category: 'business', weights: { law: 2, management: 2, education: 1 } },
      { value: 'art', label: 'Рисование и творчество', category: 'practical', weights: { design: 3, architecture: 2, media: 1 } },
    ],
  },
  {
    id: 3,
    question: 'Где бы вы хотели работать?',
    options: [
      { value: 'office', label: 'В офисе технологической компании', category: 'tech', weights: { it: 3, finance: 2, telecom: 1 } },
      { value: 'hospital', label: 'В больнице или клинике', category: 'social', weights: { medicine: 3, pharmacy: 2 } },
      { value: 'studio', label: 'В творческой студии или агентстве', category: 'creative', weights: { design: 3, media: 2, architecture: 1 } },
      { value: 'lab', label: 'В лаборатории или исследовательском центре', category: 'analytical', weights: { science: 3, research: 2 } },
      { value: 'factory', label: 'На производстве или стройке', category: 'practical', weights: { engineering: 3, agriculture: 2 } },
      { value: 'bank', label: 'В банке или финансовой компании', category: 'business', weights: { finance: 3, management: 2, law: 1 } },
    ],
  },
  {
    id: 4,
    question: 'Какой доход для вас важен в первые 3 года работы?',
    options: [
      { value: 'high', label: 'Высокий (от 2000 BYN)', category: 'tech', weights: { it: 3, finance: 2, medicine: 1 } },
      { value: 'medium', label: 'Средний (1000-2000 BYN)', category: 'analytical', weights: { engineering: 2, education: 2, management: 2 } },
      { value: 'growth', label: 'Важнее рост, чем начальная зарплата', category: 'social', weights: { medicine: 2, law: 2, it: 1 } },
      { value: 'stable', label: 'Стабильность важнее суммы', category: 'practical', weights: { education: 3, agriculture: 2, public: 2 } },
    ],
  },
  {
    id: 5,
    question: 'Как вы относитесь к физическому труду?',
    options: [
      { value: 'none', label: 'Предпочитаю сидячую работу', category: 'tech', weights: { it: 3, finance: 2, design: 2 } },
      { value: 'light', label: 'Не против легкой активности', category: 'creative', weights: { media: 2, education: 2, architecture: 1 } },
      { value: 'mixed', label: 'Хорошо, если есть разнообразие', category: 'social', weights: { medicine: 2, social: 2, agriculture: 1 } },
      { value: 'active', label: 'Люблю физическую активность', category: 'practical', weights: { engineering: 2, agriculture: 3, sports: 2 } },
    ],
  },
  {
    id: 6,
    question: 'Сколько лет вы готовы учиться после школы?',
    options: [
      { value: '1', label: '1-2 года (колледж)', category: 'practical', weights: { agriculture: 2, engineering: 1, trade: 2 } },
      { value: '4', label: '4 года (бакалавриат)', category: 'tech', weights: { it: 2, engineering: 2, finance: 2, education: 2 } },
      { value: '5', label: '5-6 лет (специалитет)', category: 'social', weights: { medicine: 3, law: 2, architecture: 2 } },
      { value: 'master', label: 'Магистратура + аспирантура', category: 'analytical', weights: { science: 3, research: 3, education: 1 } },
    ],
  },
];

interface CareerRecommendation {
  category: string;
  title: string;
  description: string;
  matchPercent: number;
  salaries: string;
  demand: string;
  examples: string[];
}

const careerRecommendations: CareerRecommendation[] = [
  { category: 'it', title: 'IT-сфера', description: 'Программирование, разработка, кибербезопасность', matchPercent: 85, salaries: '1200-3500 BYN', demand: 'Очень высокий', examples: ['Программист', 'DevOps', 'QA-инженер', 'Data Scientist'] },
  { category: 'medicine', title: 'Медицина', description: 'Лечебное дело, фармация, стоматология', matchPercent: 80, salaries: '1200-3500 BYN', demand: 'Высокий', examples: ['Врач', 'Фармацевт', 'Медсестра', 'Стоматолог'] },
  { category: 'engineering', title: 'Инженерия', description: 'Машиностроение, строительство, энергетика', matchPercent: 75, salaries: '1000-2500 BYN', demand: 'Средний', examples: ['Инженер', 'Строитель', 'Энергетик', 'Механик'] },
  { category: 'finance', title: 'Финансы и экономика', description: 'Банковское дело, бухгалтерия, аудит', matchPercent: 70, salaries: '1200-3000 BYN', demand: 'Средний', examples: ['Экономист', 'Бухгалтер', 'Аналитик', 'Аудитор'] },
  { category: 'education', title: 'Образование', description: 'Педагогика, психология', matchPercent: 72, salaries: '800-1500 BYN', demand: 'Средний', examples: ['Учитель', 'Психолог', 'Воспитатель', 'Тренер'] },
  { category: 'design', title: 'Дизайн и творчество', description: 'Графический дизайн, архитектура', matchPercent: 78, salaries: '1000-2500 BYN', demand: 'Средний', examples: ['Графический дизайнер', 'Архитектор', 'UI/UX дизайнер', 'Иллюстратор'] },
  { category: 'law', title: 'Право', description: 'Юриспруденция, правоведение', matchPercent: 68, salaries: '1000-2800 BYN', demand: 'Средний', examples: ['Юрист', 'Нотариус', 'Адвокат', 'Судья'] },
  { category: 'agriculture', title: 'Аграрные науки', description: 'Сельское хозяйство, агрономия', matchPercent: 65, salaries: '900-1800 BYN', demand: 'Средний', examples: ['Агроном', 'Ветеринар', 'Зоотехник'] },
];

interface CareerGuidanceQuizProps {
  className?: string;
}

export function CareerGuidanceQuiz({ className }: CareerGuidanceQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [saved, setSaved] = useState(false);

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (finalAnswers: string[]) => {
    const scores: Record<string, number> = {
      it: 0, medicine: 0, engineering: 0, finance: 0, 
      education: 0, design: 0, law: 0, agriculture: 0,
      science: 0, management: 0
    };

    finalAnswers.forEach((answer, index) => {
      const option = quizQuestions[index].options.find(o => o.value === answer);
      if (option && option.weights) {
        Object.entries(option.weights).forEach(([key, weight]) => {
          scores[key] = (scores[key] || 0) + weight;
        });
      }
    });

    const categoryScores = [
      { category: 'it', score: scores.it || 0 },
      { category: 'medicine', score: scores.medicine || 0 },
      { category: 'engineering', score: (scores.engineering || 0) + (scores.science || 0) * 0.5 },
      { category: 'finance', score: scores.finance || 0 },
      { category: 'education', score: scores.education || 0 },
      { category: 'design', score: scores.design || 0 },
      { category: 'law', score: scores.law || 0 },
      { category: 'agriculture', score: scores.agriculture || 0 },
    ].sort((a, b) => b.score - a.score);

    const top3 = categoryScores.slice(0, 3).map((item, index) => {
      const rec = careerRecommendations.find(r => r.category === item.category);
      if (rec) {
        return { ...rec, matchPercent: Math.min(95, 60 + item.score * 5) };
      }
      return null;
    }).filter(Boolean) as CareerRecommendation[];

    setRecommendations(top3);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setRecommendations([]);
    setSaved(false);
  };

  const saveResults = () => {
    const data = {
      answers,
      recommendations: recommendations.map(r => ({ category: r.category, matchPercent: r.matchPercent })),
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('gradpath-career-quiz-results', JSON.stringify(data));
    setSaved(true);
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <section className={cn("py-16 bg-background", className)}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-display font-bold text-foreground">
              Профориентационный тест
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Ответьте на {quizQuestions.length} вопросов, чтобы узнать, какие профессии 
            и направления обучения подходят именно вам.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key="question"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">Вопрос {currentQuestion + 1} из {quizQuestions.length}</Badge>
                      <Button variant="ghost" size="sm" onClick={resetQuiz}>
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                    <Progress value={progress} className="mb-4" />
                    <CardTitle className="text-xl">
                      {quizQuestions[currentQuestion].question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {quizQuestions[currentQuestion].options.map((option, index) => (
                      <Button
                        key={option.value}
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-4 px-4"
                        onClick={() => handleAnswer(option.value)}
                      >
                        <span className="mr-2 text-primary font-semibold">{String.fromCharCode(65 + index)}.</span>
                        {option.label}
                      </Button>
                    ))}
                    <div className="flex justify-between pt-4">
                      <Button
                        variant="ghost"
                        onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                        disabled={currentQuestion === 0}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Назад
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="border-2 border-primary/20">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <CardTitle>Ваши результаты</CardTitle>
                    </div>
                    <CardDescription>
                      На основе ваших ответов мы рекомендуем следующие направления:
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recommendations.map((rec, index) => (
                      <div
                        key={rec.category}
                        className={cn(
                          "p-4 rounded-lg border transition-all",
                          index === 0 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/30"
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              {index === 0 && <Badge className="bg-primary">Лучший матч</Badge>}
                              <h4 className="font-semibold text-lg">{rec.title}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">{rec.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{rec.matchPercent}%</div>
                            <div className="text-xs text-muted-foreground">совпадение</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 mt-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Зарплата: </span>
                            <span className="font-medium">{rec.salaries}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Спрос: </span>
                            <span className="font-medium">{rec.demand}</span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground mb-1">Примеры профессий:</p>
                          <div className="flex flex-wrap gap-1">
                            {rec.examples.map(ex => (
                              <Badge key={ex} variant="outline" className="text-xs">{ex}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" onClick={resetQuiz}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Пройти заново
                      </Button>
                      <Button className="flex-1" onClick={saveResults} disabled={saved}>
                        {saved ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Сохранено
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-4 h-4 mr-2" />
                            Сохранить результаты
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
