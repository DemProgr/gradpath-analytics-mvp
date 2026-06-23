import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Shield, LogOut, ArrowLeft, Settings, Sun, Moon, Eye, Globe, Building2, GraduationCap, BookOpen, Calendar, CheckCircle, XCircle, Edit3, AlertCircle, Verified, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api/client';
import { useProfile } from '@/hooks/useProfile';
import { DigitalProfileCard } from '@/components/profile/DigitalProfileCard';
import { useDigitalProfile } from '@/hooks/useDigitalProfile';
import { SurveyCard } from '@/components/profile/SurveyCard';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage, Language } from '@/hooks/useLanguage';

function ProfileCompletionHints() {
  const { profile } = useProfile();
  const { skills, languages, projects, certificates } = useDigitalProfile();
  const { t } = useLanguage();

  const hints: { text: string; type: 'warning' | 'info' }[] = [];

  if (!profile?.university) {
    hints.push({ text: 'Укажите университет в профиле', type: 'warning' });
  }
  if (skills.length < 3) {
    hints.push({ text: `Добавьте минимум 3 навыка (сейчас: ${skills.length})`, type: 'warning' });
  }
  if (languages.length === 0) {
    hints.push({ text: 'Добавьте языки', type: 'info' });
  }
  if (projects.length === 0) {
    hints.push({ text: 'Добавьте проекты', type: 'info' });
  }
  if (certificates.length === 0) {
    hints.push({ text: 'Добавьте сертификаты', type: 'info' });
  }

  if (hints.length === 0) return null;

  return (
    <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
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
    </div>
  );
}

export default function Profile() {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { profile, isLoading: profileLoading, sendVerificationCode, confirmVerificationCode, uploadDocument } = useProfile();
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [verifyEmailInput, setVerifyEmailInput] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [verifyMethod, setVerifyMethod] = useState<'email' | 'document'>('email');
  const [verificationStep, setVerificationStep] = useState<'input' | 'code'>('input');

  // Проверяем авторизацию
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('auth_token');
    api.setToken(null);
    toast({
      title: t('profile.logoutSuccess'),
      description: t('profile.logoutSuccessDesc'),
    });
    navigate('/');
  };

  const handleSendCode = async () => {
    if (!verifyEmailInput.trim()) {
      toast({ title: 'Ошибка', description: 'Введите email', variant: 'destructive' });
      return;
    }
    setIsSending(true);
    const { error, data } = await sendVerificationCode(verifyEmailInput.trim());
    setIsSending(false);

    if (error) {
      toast({ title: 'Ошибка', description: error.message || 'Не удалось отправить код', variant: 'destructive' });
    } else if (data?.isUniversityVerified || data?.verificationStatus === 'verified') {
      toast({ title: 'Верификация пройдена!', description: 'Ваш университет подтверждён' });
      setVerifyDialogOpen(false);
      setVerifyEmailInput('');
    } else {
      toast({ title: 'Код отправлен!', description: 'Проверьте вашу университетскую почту' });
      setVerificationStep('code');
    }
  };

  const handleConfirmCode = async () => {
    if (!verificationCode.trim()) {
      toast({ title: 'Ошибка', description: 'Введите код из письма', variant: 'destructive' });
      return;
    }
    setIsConfirming(true);
    const { error } = await confirmVerificationCode(verificationCode.trim());
    setIsConfirming(false);

    if (error) {
      toast({ title: 'Ошибка', description: error.message || 'Неверный код', variant: 'destructive' });
    } else {
      toast({ title: 'Верификация пройдена!', description: 'Ваш университет подтверждён' });
      setVerifyDialogOpen(false);
      setVerifyEmailInput('');
      setVerificationCode('');
      setVerificationStep('input');
      setCodeSent(true);
    }
  };

  const handleUploadDocument = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const { error } = await uploadDocument(base64, file.name);
        setIsUploading(false);

        if (error) {
          toast({ title: 'Ошибка', description: error.message || 'Не удалось загрузить документ', variant: 'destructive' });
        } else {
          toast({ title: 'Документ отправлен!', description: 'Ожидайте проверки модератором' });
          setVerifyDialogOpen(false);
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('profile.loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('profile.back')}
              </Button>
              <h1 className="font-serif text-xl font-semibold">{t('profile.title')}</h1>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              {t('nav.home')}
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Информация о пользователе */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{user.email?.split('@')[0]}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{t('profile.email')}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{t('profile.role')}</p>
                    <p className="text-sm text-muted-foreground">
                      {isAdmin ? t('profile.admin') : t('profile.user')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Университетский профиль */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t('profile.university')}</CardTitle>
                    <CardDescription>{t('profile.universityDesc')}</CardDescription>
                  </div>
                  {profile && profile.completeness && (
                    <Badge variant={profile.completeness.isComplete ? 'default' : 'outline'} className="text-xs">
                      {profile.completeness.percentage}%
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {profileLoading ? (
                  <div className="space-y-3">
                    <div className="h-10 bg-muted animate-pulse rounded-lg" />
                    <div className="h-10 bg-muted animate-pulse rounded-lg" />
                  </div>
                ) : profile?.university ? (
                  <div className="space-y-4">
                    {/* Completeness bar */}
                    {profile.completeness && !profile.completeness.isComplete && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Заполненность профиля</span>
                          <span>{profile.completeness.percentage}%</span>
                        </div>
                        <Progress value={profile.completeness.percentage} className="h-2" />
                      </div>
                    )}

                    {/* University info */}
                    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                      <Building2 className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{t('profile.university')}</p>
                        <p className="text-sm text-muted-foreground">
                          {profile.university.shortName || profile.university.fullName}
                        </p>
                      </div>
                    </div>

                    {/* Faculty */}
                    {profile.faculty && (
                      <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                        <GraduationCap className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{t('profile.faculty')}</p>
                          <p className="text-sm text-muted-foreground">{profile.faculty.name}</p>
                        </div>
                      </div>
                    )}

                    {/* Specialty */}
                    {profile.specialty && (
                      <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                        <BookOpen className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{t('profile.specialty')}</p>
                          <p className="text-sm text-muted-foreground">{profile.specialty.name}</p>
                        </div>
                      </div>
                    )}

                    {/* Course & Graduation */}
                    <div className="grid grid-cols-2 gap-3">
                      {profile.course && (
                        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                          <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{t('profile.course')}</p>
                            <p className="text-sm text-muted-foreground">{profile.course} курс</p>
                          </div>
                        </div>
                      )}
                      {profile.expectedGraduationYear && (
                        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                          <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{t('profile.graduationYear')}</p>
                            <p className="text-sm text-muted-foreground">{profile.expectedGraduationYear}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Verification status */}
                    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                      {profile.verificationStatus === 'verified' || profile.isUniversityVerified ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : profile.verificationStatus === 'email_sent' ? (
                        <Mail className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      ) : profile.verificationStatus === 'document_pending' ? (
                        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{t('profile.verification')}</p>
                        <p className="text-sm text-muted-foreground">
                          {profile.verificationStatus === 'verified' || profile.isUniversityVerified
                            ? t('profile.verified')
                            : profile.verificationStatus === 'email_sent'
                            ? 'Код отправлен, ожидается подтверждение'
                            : profile.verificationStatus === 'email_verified'
                            ? 'Email подтверждён'
                            : profile.verificationStatus === 'document_pending'
                            ? 'Документ на проверке'
                            : t('profile.notVerified')}
                        </p>
                      </div>
                      {!profile.isUniversityVerified && profile.verificationStatus !== 'document_pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setVerifyDialogOpen(true)}
                        >
                          {profile.verificationStatus === 'email_sent' ? 'Ввести код' : 'Подтвердить'}
                        </Button>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate('/onboarding')}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      {t('profile.editUniversity')}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">{t('profile.noUniversity')}</p>
                    <Button className="mt-4" onClick={() => navigate('/onboarding')}>
                      {t('profile.fillUniversity')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <SurveyCard />

            <ProfileCompletionHints />

            <DigitalProfileCard />

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t('profile.appearance')}</CardTitle>
                <CardDescription>{t('profile.appearanceDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      theme === 'light'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-medium ${theme === 'light' ? 'text-primary' : ''}`}>{t('profile.theme.light')}</span>
                  </button>

                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-primary' : ''}`}>{t('profile.theme.dark')}</span>
                  </button>

                  <button
                    onClick={() => setTheme('high-contrast')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      theme === 'high-contrast'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Eye className={`w-6 h-6 ${theme === 'high-contrast' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-medium ${theme === 'high-contrast' ? 'text-primary' : ''}`}>{t('profile.theme.highContrast')}</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t('profile.language')}</CardTitle>
                <CardDescription>{t('profile.languageDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setLanguage('ru')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      language === 'ru'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Globe className={`w-6 h-6 ${language === 'ru' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-medium ${language === 'ru' ? 'text-primary' : ''}`}>Русский</span>
                  </button>

                  <button
                    onClick={() => setLanguage('en')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      language === 'en'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Globe className={`w-6 h-6 ${language === 'en' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-medium ${language === 'en' ? 'text-primary' : ''}`}>English</span>
                  </button>

                  <button
                    onClick={() => setLanguage('be')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      language === 'be'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Globe className={`w-6 h-6 ${language === 'be' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-medium ${language === 'be' ? 'text-primary' : ''}`}>Беларуская</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('profile.actions')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="default"
                  className="w-full justify-start"
                  onClick={() => navigate('/resume')}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Скачать CV
                </Button>

                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      {t('profile.adminPanel')}
                    </Button>
                  </Link>
                )}

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/forgot-password')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {t('profile.changePassword')}
                </Button>

                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('profile.logout')}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Verification Dialog */}
      <Dialog open={verifyDialogOpen} onOpenChange={(open) => {
        setVerifyDialogOpen(open);
        if (!open) {
          setVerifyEmailInput('');
          setVerificationCode('');
          setVerificationStep('input');
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Подтверждение университета</DialogTitle>
            <DialogDescription>
              Выберите способ подтверждения, что вы учитесь в этом университете
            </DialogDescription>
          </DialogHeader>

          {/* Method tabs */}
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => { setVerifyMethod('email'); setVerificationStep('input'); }}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                verifyMethod === 'email' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
              }`}
            >
              По email
            </button>
            <button
              onClick={() => setVerifyMethod('document')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                verifyMethod === 'document' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
              }`}
            >
              По студ. документу
            </button>
          </div>

          {verifyMethod === 'email' ? (
            <div className="space-y-4 py-2">
              {verificationStep === 'input' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="verify-email">Университетская почта</Label>
                    <Input
                      id="verify-email"
                      type="email"
                      placeholder="student@bsuir.by"
                      value={verifyEmailInput}
                      onChange={(e) => setVerifyEmailInput(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      На эту почту будет отправлен код подтверждения
                    </p>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => setVerifyDialogOpen(false)}>Отмена</Button>
                    <Button onClick={handleSendCode} disabled={isSending}>
                      {isSending ? 'Отправка...' : 'Отправить код'}
                    </Button>
                  </DialogFooter>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="verify-code">Код подтверждения</Label>
                    <Input
                      id="verify-code"
                      type="text"
                      inputMode="numeric"
                      placeholder="Введите 6-значный код"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      Код отправлен на {verifyEmailInput}
                    </p>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => setVerificationStep('input')}>Назад</Button>
                    <Button onClick={handleConfirmCode} disabled={isConfirming}>
                      {isConfirming ? 'Проверка...' : 'Подтвердить'}
                    </Button>
                  </DialogFooter>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Загрузите фото студенческого билета или другого документа
                </p>
                <p className="text-xs text-muted-foreground">
                  Документ будет проверен модератором. Это может занять до 24 часов.
                </p>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setVerifyDialogOpen(false)}>Отмена</Button>
                <Button onClick={handleUploadDocument} disabled={isUploading}>
                  {isUploading ? 'Загрузка...' : 'Выбрать файл'}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
