import { EventsSection } from '@/components/sections/EventsSection';
import { Header } from '@/components/layout/Header';

export default function Events() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <EventsSection />
      </main>
    </div>
  );
}
