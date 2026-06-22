import { Header } from '@/components/layout/Header';

const Team = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              О нас
            </h1>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Team;