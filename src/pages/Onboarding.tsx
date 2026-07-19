import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, GraduationCap, BookOpen, Calendar, Check, ChevronLeft, ChevronRight, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api/client';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { ALL_UNIVERSITIES as STATIC_UNIVERSITIES } from '@/data/universityMarks';

interface University {
  id: string;
  short_name: string;
  full_name: string;
  name?: string;
  city: string;
}

interface Faculty {
  id: string;
  name: string;
  code?: string;
}

interface Specialty {
  id: string;
  name: string;
  code?: string;
  degreeType?: string;
  durationYears?: number;
  facultyId?: string;
}

type Step = 'university' | 'faculty' | 'specialty' | 'details';

// ⚠️ МОК-ДАННЫЕ: загружать из БД
const STEPS: { id: Step; label: string; icon: typeof Building2 }[] = [
  { id: 'university', label: '⚠️ МОК-ДАННЫЕ: шаг', icon: Building2 },
];

const COURSES = [1, 2, 3, 4, 5, 6];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((step, idx) => (
        <div key={step.id} className="flex items-center gap-2">
          <div className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all
            ${idx === currentStep ? 'bg-primary text-primary-foreground' : ''}
            ${idx < currentStep ? 'bg-primary/10 text-primary' : ''}
            ${idx > currentStep ? 'bg-muted text-muted-foreground' : ''}
          `}>
            <step.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{step.label}</span>
            {idx < currentStep && <Check className="w-3.5 h-3.5" />}
          </div>
          {idx < STEPS.length - 1 && (
            <div className={`w-8 h-0.5 ${idx < currentStep ? 'bg-primary' : 'bg-muted'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function UniversityStep({
  onSelect,
  selectedId,
}: {
  onSelect: (id: string, uni: University) => void;
  selectedId?: string;
}) {
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get<any[]>('/api/universities')
      .then((data) => {
        if (data && data.length > 0) {
          // Normalize: API returns camelCase from Drizzle, map to expected format
          const mapped = data.map((u: any) => ({
            id: u.id,
            short_name: u.shortName || u.short_name || '',
            full_name: u.fullName || u.full_name || u.name || '',
            city: u.city || '',
            website: u.website || '',
          }));
          setUniversities(mapped);
        } else {
          // Fallback to static data
          setUniversities(STATIC_UNIVERSITIES.map(u => ({
            id: u.id,
            short_name: u.short_name,
            full_name: u.full_name,
            city: u.city,
            website: u.website || '',
          })));
        }
      })
      .catch(() => {
        // Fallback to static data on error
        setUniversities(STATIC_UNIVERSITIES.map(u => ({
          id: u.id,
          short_name: u.short_name,
          full_name: u.full_name,
          city: u.city,
          website: u.website || '',
        })));
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return universities;
    const q = search.toLowerCase();
    return universities.filter(
      (u) =>
        (u.short_name || '').toLowerCase().includes(q) ||
        (u.full_name || '').toLowerCase().includes(q) ||
        (u.city || '').toLowerCase().includes(q)
    );
  }, [universities, search]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={'skel-' + i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Поиск университета..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {search ? 'Университет не найден' : 'Нет доступных университетов'}
          </p>
        ) : (
          filtered.map((uni) => (
            <button
              key={uni.id}
              onClick={() => onSelect(uni.id, uni)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedId === uni.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{uni.short_name || uni.full_name}</p>
                  <p className="text-sm text-muted-foreground truncate">{uni.full_name}</p>
                  {uni.city && (
                    <p className="text-xs text-muted-foreground">{uni.city}</p>
                  )}
                </div>
                {selectedId === uni.id && (
                  <div className="ml-auto">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function FacultyStep({
  universityId,
  universityName,
  onSelect,
  selectedId,
}: {
  universityId: string;
  universityName: string;
  onSelect: (id: string) => void;
  selectedId?: string | null;
}) {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get<Faculty[]>(`/api/faculties?university_id=${universityId}`)
      .then((data) => {
        setFaculties(data || []);
      })
      .catch(() => {
        setFaculties([]);
      })
      .finally(() => setLoading(false));
  }, [universityId]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={'skel-' + i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (faculties.length === 0) {
    return (
      <div className="text-center py-8">
        <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">Факультеты не загружены для {universityName}</p>
        <p className="text-sm text-muted-foreground mt-1">Вы можете пропустить этот шаг</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => onSelect('')}
        >
          Пропустить
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {faculties.map((fac) => (
        <button
          key={fac.id}
          onClick={() => onSelect(fac.id)}
          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
            selectedId === fac.id
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/30 hover:bg-muted/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{fac.name}</p>
              {fac.code && (
                <p className="text-sm text-muted-foreground">Код: {fac.code}</p>
              )}
            </div>
            {selectedId === fac.id && (
              <Check className="w-5 h-5 text-primary flex-shrink-0" />
            )}
          </div>
        </button>
      ))}
      <Button
        variant="ghost"
        className="w-full mt-2 text-muted-foreground"
        onClick={() => onSelect('')}
      >
        Пропустить
      </Button>
    </div>
  );
}

function SpecialtyStep({
  universityId,
  facultyId,
  onSelect,
  selectedId,
}: {
  universityId: string;
  facultyId?: string | null;
  onSelect: (id: string, specialty: Specialty) => void;
  selectedId?: string | null;
}) {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('university_id', universityId);
    if (facultyId) {
      params.set('faculty_id', facultyId);
    }
    api.get<Specialty[]>(`/api/specialties?${params}`)
      .then((data) => {
        let result = data || [];
        // Client-side safety: filter by faculty_id to handle stale server code
        if (facultyId && result.length > 0) {
          result = result.filter(
            (s) => s.facultyId === facultyId
          );
        }
        setSpecialties(result);
      })
      .catch(() => {
        setSpecialties([]);
      })
      .finally(() => setLoading(false));
  }, [universityId, facultyId]);

  const filtered = useMemo(() => {
    if (!search.trim()) return specialties;
    const q = search.toLowerCase();
    return specialties.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.code?.toLowerCase().includes(q)
    );
  }, [specialties, search]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={'skel-' + i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (specialties.length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">Нет специальностей для этого университета</p>
        <p className="text-sm text-muted-foreground mt-1">Вы можете пропустить этот шаг</p>
        <Button
          variant="outline"
          className="mt-4"
              onClick={() => onSelect('', null as any)}
        >
          Пропустить
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Поиск специальности..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {search ? 'Специальность не найдена' : 'Нет доступных специальностей'}
          </p>
        ) : (
          filtered.map((spec) => (
            <button
              key={spec.id}
              onClick={() => onSelect(spec.id, spec)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedId === spec.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{spec.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {spec.code && (
                      <span className="text-xs text-muted-foreground">{spec.code}</span>
                    )}
{spec.degreeType && (
                        <Badge variant="outline" className="text-xs">
                          {spec.degreeType === 'bachelor' ? 'Бакалавриат' : spec.degreeType}
                        </Badge>
                    )}
                  </div>
                </div>
                {selectedId === spec.id && (
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function DetailsStep({
  specialty,
  onData,
  initial,
}: {
  specialty?: Specialty | null;
  onData: (data: { course: number; enrollmentYear: number; expectedGraduationYear: number }) => void;
  initial?: { course?: number | null; enrollmentYear?: number | null; expectedGraduationYear?: number | null };
}) {
  const currentYear = new Date().getFullYear();
  const [course, setCourse] = useState<string>(initial?.course?.toString() || '');
  const [enrollmentYear, setEnrollmentYear] = useState<string>(initial?.enrollmentYear?.toString() || '');

  const duration = specialty?.durationYears || 4;

  const computedGraduationYear = enrollmentYear
    ? String(Number(enrollmentYear) + duration)
    : initial?.expectedGraduationYear?.toString() || '';

  useEffect(() => {
    if (course && enrollmentYear) {
      onData({
        course: Number(course),
        enrollmentYear: Number(enrollmentYear),
        expectedGraduationYear: Number(computedGraduationYear),
      });
    }
  }, [course, enrollmentYear, computedGraduationYear, onData]);

  const suggestedEnrollmentYear = currentYear - (Number(course) || 1);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Текущий курс</Label>
        <Select value={course} onValueChange={setCourse}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите курс" />
          </SelectTrigger>
          <SelectContent>
            {COURSES.map((c) => (
              <SelectItem key={c} value={String(c)}>
                {c} курс
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Год поступления</Label>
        <Input
          type="number"
          placeholder="Например: 2023"
          value={enrollmentYear}
          onChange={(e) => setEnrollmentYear(e.target.value)}
          min={2015}
          max={currentYear}
        />
        {course && !enrollmentYear && (
          <p className="text-xs text-muted-foreground">
            Подсказка: если вы на {course} курсе, вероятный год поступления — {suggestedEnrollmentYear}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Ожидаемый год выпуска</Label>
        <Input
          type="number"
          value={computedGraduationYear}
          disabled
          className="bg-muted"
        />
        <p className="text-xs text-muted-foreground">
          {specialty
            ? `Рассчитан исходя из длительности обучения (${duration} года)`
            : 'Рассчитан исходя из стандартной длительности обучения (4 года)'}
        </p>
      </div>

      {course && enrollmentYear && computedGraduationYear && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-primary" />
              <span>
                Выпуск в <strong>{computedGraduationYear}</strong> году
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { profile, updateUniversity } = useProfile();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedUniversity, setSelectedUniversity] = useState<{ id: string; uni: University } | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedSpecialtyObj, setSelectedSpecialtyObj] = useState<Specialty | null>(null);
  const [courseData, setCourseData] = useState<{
    course: number;
    enrollmentYear: number;
    expectedGraduationYear: number;
  } | null>(null);

  // Pre-populate from existing profile when editing
  useEffect(() => {
    if (profile?.university) {
      const uni = profile.university;
      setSelectedUniversity({
        id: uni.id,
        uni: {
          id: uni.id,
          short_name: uni.shortName || '',
          full_name: uni.fullName || uni.name || '',
          city: uni.city || '',
        },
      });
    }
    if (profile?.faculty) {
      setSelectedFaculty(profile.faculty.id);
    }
    if (profile?.specialty) {
      const spec = profile.specialty;
      setSelectedSpecialty(spec.id);
      setSelectedSpecialtyObj(spec as Specialty);
    }
  }, [profile?.university?.id, profile?.faculty?.id, profile?.specialty?.id]);

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 0: return !!selectedUniversity;
      case 1: return true;
      case 2: return true;
      case 3: return !!courseData;
      default: return false;
    }
  }, [currentStep, selectedUniversity, courseData]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleFinish = async () => {
    if (!selectedUniversity || !courseData) return;

    setIsSubmitting(true);
    const { error } = await updateUniversity({
      universityId: selectedUniversity.id,
      facultyId: selectedFaculty,
      specialtyId: selectedSpecialty,
      ...courseData,
    });

    if (error) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось сохранить профиль',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Профиль заполнен!',
        description: 'Университетские данные сохранены',
      });
      navigate('/profile');
    }

    setIsSubmitting(false);
  };

  const direction = currentStep;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              На главную
            </Button>
            <h1 className="font-serif text-xl font-semibold">Настройка профиля</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-muted-foreground"
            >
              Пропустить
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <StepIndicator currentStep={currentStep} />

          <Card>
            <CardHeader>
              <CardTitle>{STEPS[currentStep].label}</CardTitle>
              <CardDescription>
                {currentStep === 0 && 'Выберите ваш университет'}
                {currentStep === 1 && 'Выберите факультет (необязательно)'}
                {currentStep === 2 && 'Выберите вашу специальность (необязательно)'}
                {currentStep === 3 && 'Укажите курс и год поступления'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentStep === 0 && (
                    <UniversityStep
                      selectedId={selectedUniversity?.id}
                      onSelect={(id, uni) => {
                        setSelectedUniversity({ id, uni });
                        setSelectedFaculty(null);
                        setSelectedSpecialty(null);
                      }}
                    />
                  )}
                  {currentStep === 1 && selectedUniversity && (
                    <FacultyStep
                      universityId={selectedUniversity.id}
                      universityName={selectedUniversity.uni.short_name || selectedUniversity.uni.full_name}
                      selectedId={selectedFaculty}
                      onSelect={(id) => {
                        setSelectedFaculty(id || null);
                        setSelectedSpecialty(null);
                      }}
                    />
                  )}
                  {currentStep === 2 && selectedUniversity && (
                    <SpecialtyStep
                      universityId={selectedUniversity.id}
                      facultyId={selectedFaculty}
                      selectedId={selectedSpecialty}
                      onSelect={(id, spec) => {
                        setSelectedSpecialty(id || null);
                        setSelectedSpecialtyObj(spec || null);
                      }}
                    />
                  )}
                  {currentStep === 3 && (
                    <DetailsStep
                      specialty={selectedSpecialtyObj}
                      initial={{
                        course: profile?.course,
                        enrollmentYear: profile?.enrollmentYear,
                        expectedGraduationYear: profile?.expectedGraduationYear,
                      }}
                      onData={(data) => setCourseData(data)}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>

            <div className="flex items-center gap-2">
              {currentStep < STEPS.length - 1 ? (
                <Button onClick={handleNext} disabled={!canProceed}>
                  Далее
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleFinish}
                  disabled={!canProceed || isSubmitting}
                >
                  {isSubmitting ? (
                    'Сохранение...'
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Завершить
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
