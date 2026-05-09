import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { FooterSection } from '@/components/sections/FooterSection';
import { UniversitiesSection } from '@/components/sections/UniversitiesSection';

const UniversitiesPage = () => {
  const [activeSection, setActiveSection] = useState('universities');

  return (
    <div className="min-h-screen bg-background">
      <Header activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="pt-20">
        <UniversitiesSection />
      </div>

      <FooterSection onNavigate={() => {}} />
    </div>
  );
};

export default UniversitiesPage;