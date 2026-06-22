import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useSurveys, Survey } from '@/hooks/useSurveys';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

function SurveyDialog({
  open,
  onClose,
  milestone,
}: {
  open: boolean;
  onClose: () => void;
  milestone: string;
}) {
  const { submitSurvey } = useSurveys();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isEmployed, setIsEmployed] = useState<boolean | null>(null);
  const [country, setCountry] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState('');
  const [isInSpecialty, setIsInSpecialty] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isEmployed === null) {
      toast({ title: t('survey.employedError'), description: t('survey.employedErrorDesc'), variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    const data: any = {
      milestone,
      isEmployed,
      country: isEmployed ? country : null,
      company: isEmployed ? company : null,
      position: isEmployed ? position : null,
      salary: isEmployed && salary ? parseInt(salary) : null,
      isInSpecialty: isEmployed && isInSpecialty !== null ? isInSpecialty : null,
    };

    const { error } = await submitSurvey(data);
    setIsSubmitting(false);

    if (error) {
      toast({ title: t('survey.error'), description: error.message, variant: 'destructive' });
    } else {
      toast({ title: t('survey.thanks'), description: t('survey.saved') });
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{milestone ? t(`survey.milestone.${milestone}`) : t('survey.dialogTitle')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 max-h-96 overflow-y-auto pr-1">
          <div className="space-y-3">
            <Label>{t('survey.employed')}</Label>
            <RadioGroup
              value={isEmployed === null ? '' : isEmployed ? 'yes' : 'no'}
              onValueChange={(v) => setIsEmployed(v === 'yes')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="employed-yes" />
                <Label htmlFor="employed-yes">{t('survey.yes')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="employed-no" />
                <Label htmlFor="employed-no">{t('survey.no')}</Label>
              </div>
            </RadioGroup>
          </div>

          {isEmployed && (
            <>
              <div className="space-y-2">
                <Label>{t('survey.country')}</Label>
                <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Беларусь" />
              </div>
              <div className="space-y-2">
                <Label>{t('survey.company')}</Label>
                <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="EPAM" />
              </div>
              <div className="space-y-2">
                <Label>{t('survey.position')}</Label>
                <Input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Junior Developer" />
              </div>
              <div className="space-y-2">
                <Label>{t('survey.salary')}</Label>
                <Input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="1500" />
              </div>
              <div className="space-y-3">
                <Label>{t('survey.inSpecialty')}</Label>
                <RadioGroup
                  value={isInSpecialty === null ? '' : isInSpecialty ? 'yes' : 'no'}
                  onValueChange={(v) => setIsInSpecialty(v === 'yes')}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="spec-yes" />
                    <Label htmlFor="spec-yes">{t('survey.yes')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="spec-no" />
                    <Label htmlFor="spec-no">{t('survey.no')}</Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{t('survey.cancel')}</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? t('survey.sending') : t('survey.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TrajectoryTimeline({ surveys, graduationYear }: { surveys: Survey[]; graduationYear: number | null }) {
  const { t } = useLanguage();
  if (surveys.length === 0) return null;

  return (
    <div className="space-y-3">
      {surveys.map((s, i) => {
        const year = s.year || (graduationYear ? graduationYear + Math.round(
          s.milestone === '6months' ? 0.5 : s.milestone === '2years' ? 2 : 5
        ) : null);
        return (
          <div key={s.id} className="relative pl-6 pb-3 border-l-2 border-primary/30 last:border-transparent">
            <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-primary" />
            <p className="text-xs text-muted-foreground">{year}</p>
            {s.isEmployed ? (
              <>
                <p className="text-sm font-medium">{s.position || t('survey.employed')}</p>
                <p className="text-xs text-muted-foreground">
                  {[s.company, s.country].filter(Boolean).join(', ')}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">{t('survey.notEmployed')}</p>
            )}
            <Badge variant="outline" className="text-[10px] mt-1">
              {s.milestone === '6months' ? '+6 ' + t('survey.shortMonths') : s.milestone === '2years' ? '+2 ' + t('survey.shortYears') : '+5 ' + t('survey.shortYears')}
            </Badge>
          </div>
        );
      })}
    </div>
  );
}

export function SurveyCard() {
  const { status, trajectory, isLoading } = useSurveys();
  const { t } = useLanguage();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<string>('6months');

  if (isLoading) return null;

  const hasTrajectory = trajectory.length > 0;
  const canFill = status?.canFill;
  const available = status?.availableMilestones || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 }}
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            {t('survey.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!status?.graduationYear || status.reason === 'still_studying' ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t('survey.stillStudying')}
            </p>
          ) : canFill ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {t('survey.available', { months: status.monthsSinceGraduation ?? 0 })}
              </p>
              {available.map((ms) => (
                <Button
                  key={ms}
                  className="w-full"
                  onClick={() => { setSelectedMilestone(ms); setDialogOpen(true); }}
                >
                  {t('survey.button')}: {t(`survey.milestone.${ms}`)}
                </Button>
              ))}
              {hasTrajectory && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">{t('survey.yourPath')}</p>
                  <TrajectoryTimeline surveys={trajectory} graduationYear={status.graduationYear} />
                </div>
              )}
            </div>
          ) : hasTrajectory ? (
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                {t('survey.allDone')} {t('survey.nextMilestone', { milestone: status.nextMilestone ? t(`survey.milestone.${status.nextMilestone}`) : '—' })}
              </p>
              <TrajectoryTimeline surveys={trajectory} graduationYear={status.graduationYear} />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              {status.reason === 'wait'
                ? t('survey.wait')
                : t('survey.noData')}
            </p>
          )}
        </CardContent>
      </Card>

      <SurveyDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        milestone={selectedMilestone}
      />
    </motion.div>
  );
}
