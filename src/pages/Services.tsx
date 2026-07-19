import { Header } from '@/components/layout/Header';
import { Link } from 'react-router-dom';
import { Brain, BarChart3, GraduationCap, Briefcase, Calendar, Map, BookOpen, Target, Users, UserCheck } from 'lucide-react';

// ⚠️ МОК-ДАННЫЕ: загружать из БД
const categories = [
  {
    id: '⚠️ МОК-ДАННЫЕ: id',
    title: '⚠️ МОК-ДАННЫЕ: заголовок',
    subtitle: '⚠️ МОК-ДАННЫЕ: подзаголовок',
    icon: Target,
    color: 'from-blue-500/10 to-blue-500/5',
    borderColor: 'border-blue-500/20',
    badgeColor: 'bg-blue-500/10 text-blue-600',
    hoverBorder: 'hover:border-blue-500/50',
    services: [
      { icon: Brain, title: '⚠️ МОК-ДАННЫЕ: услуга', desc: '⚠️ МОК-ДАННЫЕ: описание', link: '/' },
    ]
  },
];

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Наши услуги
            </h1>
            <p className="text-lg text-muted-foreground mb-16 max-w-2xl">
              Мы предлагаем комплекс инструментов и ресурсов для каждого этапа вашего образовательного и карьерного пути.
            </p>

            <div className="space-y-16">
              {categories.map((category) => (
                <div key={category.id}>
                  <div className="flex items-center gap-3 mb-2">
                    <category.icon className="w-6 h-6 text-foreground" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{category.title}</h2>
                  </div>
                  <p className="text-muted-foreground mb-8 ml-9">{category.subtitle}</p>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.services.map((service) => (
                      <Link
                        key={service.link}
                        to={service.link}
                        className={`group p-6 rounded-xl border ${category.borderColor} ${category.color} ${category.hoverBorder} hover:shadow-lg transition-all`}
                      >
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${category.badgeColor}`}>
                          {category.title}
                        </span>
                        <service.icon className="w-10 h-10 text-foreground mb-4" />
                        <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground">{service.desc}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Services;
