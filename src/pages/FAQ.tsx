import { Header } from '@/components/layout/Header';
import { FooterSection } from '@/components/sections/FooterSection';

const FAQ = () => {
  const handleNavigate = () => {};

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
      </main>
      <FooterSection onNavigate={handleNavigate} />
    </div>
  );
};

export default FAQ;