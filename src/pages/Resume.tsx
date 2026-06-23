import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Loader2, AlertCircle, Building2, GraduationCap, BookOpen, Calendar, Mail, Globe, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api/client';
import { useToast } from '@/hooks/use-toast';

interface ResumeData {
  user: { id: number; email: string };
  profile: any;
  university: any;
  faculty: any;
  specialty: any;
  skills: any[];
  languages: any[];
  projects: any[];
  certificates: any[];
}

const PROFICIENCY_LABELS: Record<string, string> = {
  beginner: 'Начальный', intermediate: 'Средний', advanced: 'Продвинутый', expert: 'Эксперт',
};
const CEFR_LABELS: Record<string, string> = {
  A1: 'A1', A2: 'A2', B1: 'B1', B2: 'B2', C1: 'C1', C2: 'C2',
};

function ResumeTemplate({ data, t }: { data: ResumeData; t: (k: string) => string }) {
  const { user, profile, university, faculty, specialty, skills, languages, projects, certificates } = data;

  return (
    <div className="bg-white text-gray-900 p-8 max-w-[210mm] mx-auto shadow-lg" id="resume-content">
      {/* Header */}
      <div className="border-b-2 border-primary pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {user?.email?.split('@')[0] || 'Пользователь'}
        </h1>
        <p className="text-gray-600 mt-1">{user?.email}</p>
      </div>

      {/* Education */}
      {university && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-primary border-b border-gray-200 pb-1 mb-3">Образование</h2>
          <div className="space-y-1">
            <p className="font-medium">{university.shortName || university.fullName}</p>
            {faculty && <p className="text-sm text-gray-600">{faculty.name}</p>}
            {specialty && <p className="text-sm text-gray-600">{specialty.name}</p>}
            {profile?.course && <p className="text-sm text-gray-600">{profile.course} курс</p>}
            {profile?.expectedGraduationYear && (
              <p className="text-sm text-gray-500">Окончание: {profile.expectedGraduationYear} г.</p>
            )}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-primary border-b border-gray-200 pb-1 mb-3">Навыки</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill.id} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                {skill.name}
                <span className="text-xs text-gray-500">({PROFICIENCY_LABELS[skill.proficiencyLevel] || skill.proficiencyLevel})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-primary border-b border-gray-200 pb-1 mb-3">Языки</h2>
          <div className="space-y-1">
            {languages.map((lang) => (
              <p key={lang.id} className="text-sm">
                {lang.name} — <span className="font-medium">{CEFR_LABELS[lang.cefrLevel] || lang.cefrLevel}</span>
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-primary border-b border-gray-200 pb-1 mb-3">Проекты</h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm">{proj.title}</p>
                    {proj.role && <p className="text-xs text-gray-500">{proj.role}</p>}
                  </div>
                  {(proj.startDate || proj.endDate) && (
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {proj.startDate ? new Date(proj.startDate).toLocaleDateString('ru-RU', { year: 'numeric', month: 'short' }) : ''}
                      {proj.startDate && proj.endDate ? ' — ' : ''}
                      {proj.endDate ? new Date(proj.endDate).toLocaleDateString('ru-RU', { year: 'numeric', month: 'short' }) : ''}
                    </span>
                  )}
                </div>
                {proj.description && <p className="text-xs text-gray-600 mt-1">{proj.description}</p>}
                {proj.url && (
                  <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1">
                    <ExternalLink className="w-3 h-3" /> {proj.url}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificates */}
      {certificates.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-primary border-b border-gray-200 pb-1 mb-3">Сертификаты</h2>
          <div className="space-y-2">
            {certificates.map((cert) => (
              <div key={cert.id}>
                <p className="font-medium text-sm">{cert.name}</p>
                <p className="text-xs text-gray-500">{cert.issuer}</p>
                {cert.url && (
                  <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                    Подтверждение
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No data */}
      {!university && skills.length === 0 && languages.length === 0 && projects.length === 0 && certificates.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>Заполните профиль, чтобы создать резюме</p>
        </div>
      )}
    </div>
  );
}

function CompletionHints({ data }: { data: ResumeData }) {
  const hints: { text: string; type: 'warning' | 'info' }[] = [];

  if (!data.profile?.universityId) {
    hints.push({ text: 'Укажите университет в профиле', type: 'warning' });
  }
  if (data.skills.length < 3) {
    hints.push({ text: `Добавьте минимум 3 навыка (сейчас: ${data.skills.length})`, type: 'warning' });
  }
  if (data.languages.length === 0) {
    hints.push({ text: 'Добавьте языки', type: 'info' });
  }
  if (data.projects.length === 0) {
    hints.push({ text: 'Добавьте проекты (курсовые, стартапы, GitHub)', type: 'info' });
  }
  if (data.certificates.length === 0) {
    hints.push({ text: 'Добавьте сертификаты (Coursera, Stepik, Cisco)', type: 'info' });
  }

  if (hints.length === 0) return null;

  return (
    <Card className="mb-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Рекомендации по заполнению</p>
            {hints.map((hint, i) => (
              <p key={'hint-' + i} className={`text-sm ${hint.type === 'warning' ? 'text-amber-700 dark:text-amber-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {hint.type === 'warning' ? '⚠ ' : '• '}{hint.text}
              </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Resume() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) { navigate('/login'); return; }

    api.get<ResumeData>('/api/resume/data')
      .then(setData)
      .catch((err) => {
        console.error('Resume load error:', err);
        toast({ title: 'Ошибка', description: err.message || 'Не удалось загрузить данные', variant: 'destructive' });
      })
      .finally(() => setLoading(false));
  }, [navigate, toast]);

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;

    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF('p', 'mm', 'a4');
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save('resume.pdf');
      toast({ title: 'PDF сохранён', description: 'Резюме скачано' });
    } catch (err: any) {
      toast({ title: 'Ошибка', description: err.message || 'Не удалось создать PDF', variant: 'destructive' });
    } finally {
      setDownloading(false);
    }
  };

  const t = (key: string) => key;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Не удалось загрузить данные профиля</p>
          <Button onClick={() => navigate('/profile')}>Вернуться в профиль</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <h1 className="font-serif text-xl font-semibold">Резюме</h1>
            <Button onClick={handleDownloadPDF} disabled={downloading} size="sm">
              {downloading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {downloading ? 'Создание PDF...' : 'Скачать PDF'}
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-12 px-4">
        <div className="max-w-[210mm] mx-auto">
          <CompletionHints data={data} />

          <motion.div
            ref={resumeRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ResumeTemplate data={data} t={t} />
          </motion.div>

          <div className="text-center mt-6">
            <p className="text-xs text-gray-400">
              Резюме создано на основе данных профиля. Для обновления отредактируйте профиль.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
