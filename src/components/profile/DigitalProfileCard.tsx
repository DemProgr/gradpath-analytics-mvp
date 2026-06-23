import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SkillsSection } from './SkillsSection';
import { LanguagesSection } from './LanguagesSection';
import { ProjectsSection } from './ProjectsSection';
import { CertificatesSection } from './CertificatesSection';
import { useDigitalProfile } from '@/hooks/useDigitalProfile';
import { useLanguage } from '@/hooks/useLanguage';

export function DigitalProfileCard() {
  const { t } = useLanguage();
  const { skills, languages, projects, certificates, isLoading } = useDigitalProfile();

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('profile.digitalProfile')}</CardTitle>
          <CardDescription>{t('profile.digitalProfileDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-10 bg-muted animate-pulse rounded-lg" />
            <div className="h-10 bg-muted animate-pulse rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('profile.digitalProfile')}</CardTitle>
          <CardDescription>{t('profile.digitalProfileDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="skills">
            <TabsList className="w-full grid grid-cols-4 mb-4">
              <TabsTrigger value="skills">{t('profile.skills')}{skills.length > 0 && ` (${skills.length})`}</TabsTrigger>
              <TabsTrigger value="languages">{t('profile.languages')}{languages.length > 0 && ` (${languages.length})`}</TabsTrigger>
              <TabsTrigger value="projects">{t('profile.projects')}{projects.length > 0 && ` (${projects.length})`}</TabsTrigger>
              <TabsTrigger value="certificates">{t('profile.certificates')}{certificates.length > 0 && ` (${certificates.length})`}</TabsTrigger>
            </TabsList>
            <TabsContent value="skills">
              <SkillsSection />
            </TabsContent>
            <TabsContent value="languages">
              <LanguagesSection />
            </TabsContent>
            <TabsContent value="projects">
              <ProjectsSection />
            </TabsContent>
            <TabsContent value="certificates">
              <CertificatesSection />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
