import { CareerGuidanceQuiz } from '@/components/sections/CareerGuidanceQuiz';
import { Header } from '@/components/layout/Header';
import { FooterSection } from '@/components/sections/FooterSection';

export default function CareerQuiz() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CareerGuidanceQuiz />
      <FooterSection />
    </div>
  );
}
