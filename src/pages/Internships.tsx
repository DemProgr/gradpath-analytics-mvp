import { InternshipsSection } from '@/components/sections/InternshipsSection';
import { Header } from '@/components/layout/Header';

export default function Internships() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <InternshipsSection />
      </main>
    </div>
  );
}
