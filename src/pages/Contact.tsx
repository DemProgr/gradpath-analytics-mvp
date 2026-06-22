import { Header } from '@/components/layout/Header';
import { Link } from 'react-router-dom';
import { FileText, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="w-full py-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground" style={{ fontFamily: 'Times New Roman, serif' }}>
            Связаться с нами
          </h1>
        </section>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-card border-y border-border rounded-none"
          >
            <div className="w-full p-6 flex justify-center items-center gap-4">
              <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-primary flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground" style={{ fontFamily: 'Times New Roman, serif' }}>
                Добро пожаловать на нашу страницу контактов!
              </h2>
            </div>

            <div className="max-w-2xl mx-auto h-px bg-foreground/30" />

            <section className="w-full p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="flex items-center gap-4">
                  <Mail className="w-12 h-12 sm:w-14 sm:h-14 text-primary flex-shrink-0" />
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground" style={{ fontFamily: 'Times New Roman, serif' }}>
                    Электронная почта: businessdanik17211@gmail.com
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-12 h-12 sm:w-14 sm:h-14 text-primary flex-shrink-0" />
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground" style={{ fontFamily: 'Times New Roman, serif' }}>
                    Наш номер телефона: +375 44 4711944
                  </p>
                </div>
              </div>
            </section>

            <div className="max-w-2xl mx-auto h-px bg-foreground/30" />

            <section className="w-full p-6 text-center">
              <p className="text-lg sm:text-xl text-muted-foreground" style={{ fontFamily: 'Times New Roman, serif' }}>
                Единый для всех номер
              </p>
              <p className="text-lg sm:text-xl text-muted-foreground mt-4" style={{ fontFamily: 'Times New Roman, serif' }}>
                Ознакомтесь с разделом{' '}
                <Link to="/faq" className="text-primary hover:text-primary/80 underline">
                  часто задаваемых вопросов (FAQ)
                </Link>
              </p>
            </section>
          </motion.div>
      </main>
    </div>
  );
};

export default Contact;