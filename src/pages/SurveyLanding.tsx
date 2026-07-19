import { Header } from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, HelpCircle, Mail, CheckCircle2, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// ⚠️ МОК-ДАННЫЕ: загружать из БД
const sidebarLinks = [
  { label: 'surveyLanding.sidebar.main', href: '/', isSection: true },
];

export default function SurveyLanding() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // ⚠️ МОК-ДАННЫЕ: загружать из БД
  const faqs = [
    { q: t('surveyLanding.faq1q'), a: t('surveyLanding.faq1a') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">

        {/* Breadcrumb */}
        <div className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <p className="text-xs text-muted-foreground">
              <a href="/" className="hover:text-primary transition-colors">{t('nav.home')}</a>
              <span className="mx-2">/</span>
              <a href="/students" className="hover:text-primary transition-colors">{t('surveyLanding.sidebar.main')}</a>
              <span className="mx-2">/</span>
              <span className="text-foreground">{t('surveyLanding.title')}</span>
            </p>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

            {/* Left sidebar */}
            <aside className="lg:w-56 shrink-0">
              <nav className="sticky top-24">
                <ul className="space-y-1">
                  {sidebarLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                          link.isActive
                            ? "bg-primary/10 text-primary font-medium"
                            : link.isSection
                              ? "font-semibold text-foreground hover:bg-muted"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {link.isActive && <ChevronRight className="w-3 h-3" />}
                        {t(link.label)}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Title */}
                <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight">
                  {t('surveyLanding.title')}
                </h1>
                <p className="text-lg text-muted-foreground mb-10 max-w-2xl">{t('surveyLanding.subtitle')}</p>

                {/* Intro text */}
                <div className="prose prose-lg max-w-none mb-10">
                  <p className="text-base leading-relaxed">
                    <strong className="text-foreground">{t('surveyLanding.introBold')}</strong>{' '}
                    <span className="text-foreground/80">{t('surveyLanding.introText')}</span>
                  </p>
                </div>

                {/* Why important - bullet list */}
                <h2 className="text-2xl font-bold mb-5">{t('surveyLanding.whyTitle')}</h2>
                <ul className="space-y-4 mb-6">
                  {[
                    t('surveyLanding.benefit1Desc'),
                    t('surveyLanding.benefit2Desc'),
                    t('surveyLanding.benefit3Desc'),
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span className="text-base text-foreground/80">{text}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-base text-muted-foreground mb-12">
                  {t('surveyLanding.cvHint')}
                </p>

                {/* CTA section */}
                <h2 className="text-2xl font-bold mb-6">{t('surveyLanding.ctaSectionTitle')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">

                  {/* Card 1: Already registered */}
                  <Card>
                    <CardContent className="p-6 flex flex-col h-full">
                      <h3 className="font-semibold text-lg mb-2">{t('surveyLanding.card1Title')}</h3>
                      <p className="text-sm text-foreground/70 mb-5 flex-1">
                        {t('surveyLanding.card1Desc')}
                      </p>
                      <a href={user ? '/profile' : '/login'}>
                        <Button className="w-full gap-2">
                          <LogIn className="w-4 h-4" />
                          {user ? t('surveyLanding.ctaProfile') : t('surveyLanding.loginCta')}
                        </Button>
                      </a>
                    </CardContent>
                  </Card>

                  {/* Card 2: Not registered */}
                  <Card>
                    <CardContent className="p-6 flex flex-col h-full">
                      <h3 className="font-semibold text-lg mb-2">{t('surveyLanding.card2Title')}</h3>
                      <p className="text-sm text-foreground/70 mb-5 flex-1">
                        {t('surveyLanding.card2Desc')}
                      </p>
                      <a href="/register">
                        <Button variant="outline" className="w-full gap-2">
                          <UserPlus className="w-4 h-4" />
                          {t('surveyLanding.ctaRegister')}
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                </div>

                {/* Any doubts? */}
                <Card className="border-dashed mb-12">
                  <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <HelpCircle className="w-7 h-7 text-primary shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{t('surveyLanding.doubtsTitle')}</h3>
                      <p className="text-sm text-foreground/70">{t('surveyLanding.doubtsDesc')}</p>
                    </div>
                    <a href="/faq">
                      <Button variant="outline" size="sm" className="shrink-0">
                        {t('surveyLanding.faqLink')}
                      </Button>
                    </a>
                  </CardContent>
                </Card>

                {/* FAQ section */}
                <h2 className="text-2xl font-bold mb-6">{t('surveyLanding.faqTitle')}</h2>
                <div className="space-y-2 mb-12">
                  {faqs.map((faq, i) => (
                    <div key={i}>
                      <button
                        className={cn(
                          "w-full text-left p-4 rounded-lg flex items-start justify-between gap-4 transition-colors",
                          openFaq === i
                            ? "bg-card border border-border"
                            : "hover:bg-card/50"
                        )}
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      >
                        <span className="text-base font-medium">{faq.q}</span>
                        <span className={cn(
                          "text-muted-foreground text-lg shrink-0 transition-transform",
                          openFaq === i ? "rotate-45" : ""
                        )}>+</span>
                      </button>
                      {openFaq === i && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="px-4 pb-4 text-base text-foreground/70"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Support / Contact */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-3">{t('surveyLanding.supportTitle')}</h2>
                    <p className="text-sm text-foreground/70 mb-5">
                      {t('surveyLanding.supportDesc')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a href="/faq">
                        <Button variant="outline" className="gap-2">
                          <HelpCircle className="w-4 h-4" />
                          {t('surveyLanding.faqLink')}
                        </Button>
                      </a>
                      <a href="/contact">
                        <Button variant="outline" className="gap-2">
                          <Mail className="w-4 h-4" />
                          {t('surveyLanding.contactLink')}
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>

              </motion.div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
