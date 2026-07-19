import { Header } from '@/components/layout/Header';
import { Link } from 'react-router-dom';
import { BarChart3, PieChart, TrendingUp, FileText, Building2 } from 'lucide-react';

// ⚠️ МОК-ДАННЫЕ: загружать из БД
const dataItems = [
  { icon: BarChart3, title: '⚠️ МОК-ДАННЫЕ: название', desc: '⚠️ МОК-ДАННЫЕ: описание', link: '/' },
];

const Data = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Наши данные
            </h1>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
              Мы собираем и анализируем данные об образовании, поступлении и рынке труда, чтобы предоставить вам актуальную информацию для принятия решений.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dataItems.map((item) => (
                <Link
                  key={item.link}
                  to={item.link}
                  className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all"
                >
                  <item.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Data;
