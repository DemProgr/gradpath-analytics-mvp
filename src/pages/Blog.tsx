import { BlogSection } from '@/components/sections/BlogSection';
import { Header } from '@/components/layout/Header';
export default function Blog() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <BlogSection />
      </main>
    </div>
  );
}
