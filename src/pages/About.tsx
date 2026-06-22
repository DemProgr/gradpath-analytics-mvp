import { Header } from '@/components/layout/Header';
import { FileText, Download } from 'lucide-react';

const About = () => {

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="mb-12 px-4 md:px-8 pt-16">
          <h1 className="text-5xl font-bold text-foreground">О проекте</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-8 border-r border-border bg-card min-h-[300px]">
            <h2 className="text-2xl font-bold text-foreground mb-4">Для пользователей</h2>
            <a 
              href="/docs/GRADPATH.docx" 
              download 
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer"
            >
              <FileText className="h-10 w-10 text-primary" />
              <div className="flex-1">
                <p className="font-medium text-foreground">Руководство пользователя</p>
                <p className="text-sm text-muted-foreground">DOCX • Скачать</p>
              </div>
              <Download className="h-5 w-5 text-muted-foreground" />
            </a>
          </div>

          <div className="p-8 bg-card">
            <h2 className="text-2xl font-bold text-foreground mb-4">Описание</h2>
            <a 
              href="/docs/PROJECT_DESCRIPTION.txt" 
              download 
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer"
            >
              <FileText className="h-10 w-10 text-primary" />
              <div className="flex-1">
                <p className="font-medium text-foreground">Полное описание проекта</p>
                <p className="text-sm text-muted-foreground">TXT • Скачать</p>
              </div>
              <Download className="h-5 w-5 text-muted-foreground" />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;