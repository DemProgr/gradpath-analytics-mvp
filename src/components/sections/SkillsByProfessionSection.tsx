import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Code, Palette, TrendingUp, Brain, Users, Stethoscope, Calculator, Briefcase, BookOpen, Plus, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Skill {
  name: string;
  level: number;
  category: 'hard' | 'soft';
}

interface ProfessionSkills {
  profession: string;
  category: string;
  hardSkills: Skill[];
  softSkills: Skill[];
  certifications: string[];
  courses: { name: string; provider: string; duration: string }[];
}

const professionsData: ProfessionSkills[] = [
  {
    profession: 'Программист',
    category: 'ИТ',
    hardSkills: [
      { name: 'JavaScript/TypeScript', level: 85, category: 'hard' },
      { name: 'React/Angular', level: 80, category: 'hard' },
      { name: 'Node.js', level: 75, category: 'hard' },
      { name: 'SQL/NoSQL', level: 70, category: 'hard' },
      { name: 'Git', level: 90, category: 'hard' },
      { name: 'Docker/Kubernetes', level: 60, category: 'hard' },
    ],
    softSkills: [
      { name: 'Коммуникация', level: 75, category: 'soft' },
      { name: 'Работа в команде', level: 85, category: 'soft' },
      { name: 'Самообучение', level: 95, category: 'soft' },
    ],
    certifications: ['AWS Certified Developer', 'Google Cloud Professional', 'Meta Front-End Developer'],
    courses: [
      { name: 'Fullstack-разработчик', provider: 'Skillbox', duration: '12 месяцев' },
      { name: 'JavaScript React', provider: 'Coursera', duration: '4 месяца' },
    ],
  },
  {
    profession: 'Data Scientist',
    category: 'ИТ',
    hardSkills: [
      { name: 'Python', level: 95, category: 'hard' },
      { name: 'Machine Learning', level: 85, category: 'hard' },
      { name: 'SQL', level: 80, category: 'hard' },
      { name: 'TensorFlow/PyTorch', level: 75, category: 'hard' },
      { name: 'Statistics', level: 90, category: 'hard' },
      { name: 'Data Visualization', level: 70, category: 'hard' },
    ],
    softSkills: [
      { name: 'Аналитическое мышление', level: 95, category: 'soft' },
      { name: 'Внимание к деталям', level: 90, category: 'soft' },
      { name: 'Презентация результатов', level: 75, category: 'soft' },
    ],
    certifications: ['Google Data Analytics', 'IBM Data Science', 'AWS Machine Learning'],
    courses: [
      { name: 'Machine Learning', provider: 'Coursera (Andrew Ng)', duration: '11 недель' },
      { name: 'Data Science Specialization', provider: 'Coursera', duration: '8 месяцев' },
    ],
  },
  {
    profession: 'UI/UX Дизайнер',
    category: 'Дизайн',
    hardSkills: [
      { name: 'Figma', level: 95, category: 'hard' },
      { name: 'Adobe XD', level: 80, category: 'hard' },
      { name: 'Прототипирование', level: 90, category: 'hard' },
      { name: 'User Research', level: 85, category: 'hard' },
      { name: 'UI Animation', level: 75, category: 'hard' },
      { name: 'HTML/CSS Basics', level: 65, category: 'hard' },
    ],
    softSkills: [
      { name: 'Креативность', level: 95, category: 'soft' },
      { name: 'Эмпатия', level: 90, category: 'soft' },
      { name: 'Внимание к деталям', level: 85, category: 'soft' },
    ],
    certifications: ['Google UX Design', 'Interaction Design Foundation', 'Figma Certification'],
    courses: [
      { name: 'UI/UX Дизайн', provider: 'Skillbox', duration: '6 месяцев' },
      { name: 'UX Research', provider: 'Coursera', duration: '3 месяца' },
    ],
  },
  {
    profession: 'Графический дизайнер',
    category: 'Дизайн',
    hardSkills: [
      { name: 'Adobe Photoshop', level: 95, category: 'hard' },
      { name: 'Adobe Illustrator', level: 90, category: 'hard' },
      { name: 'InDesign', level: 80, category: 'hard' },
      { name: 'Типографика', level: 85, category: 'hard' },
      { name: 'Цветоведение', level: 80, category: 'hard' },
      { name: 'Figma', level: 75, category: 'hard' },
    ],
    softSkills: [
      { name: 'Креативность', level: 95, category: 'soft' },
      { name: 'Художественное мышление', level: 90, category: 'soft' },
      { name: 'Соблюдение дедлайнов', level: 80, category: 'soft' },
    ],
    certifications: ['Adobe Certified Expert', 'Graphic Design Certificate', 'D&AD Awards'],
    courses: [
      { name: 'Графический дизайн', provider: 'Bangbang Education', duration: '8 месяцев' },
      { name: 'Adobe Photoshop для дизайнеров', provider: 'Skillbox', duration: '3 месяца' },
    ],
  },
  {
    profession: 'Архитектор',
    category: 'Архитектура',
    hardSkills: [
      { name: 'AutoCAD', level: 95, category: 'hard' },
      { name: 'Revit', level: 90, category: 'hard' },
      { name: 'SketchUp', level: 85, category: 'hard' },
      { name: '3ds Max', level: 80, category: 'hard' },
      { name: 'Строительные нормы', level: 90, category: 'hard' },
      { name: 'Проектирование', level: 85, category: 'hard' },
    ],
    softSkills: [
      { name: 'Пространственное мышление', level: 95, category: 'soft' },
      { name: 'Креативность', level: 90, category: 'soft' },
      { name: 'Коммуникация с заказчиком', level: 85, category: 'soft' },
    ],
    certifications: ['ARCHICAD Certified Professional', 'LEED AP', 'Свидетельство СРО'],
    courses: [
      { name: 'Архитектура', provider: 'МАРХИ', duration: '6 лет' },
      { name: 'Revit Architecture', provider: 'Autodesk', duration: '2 месяца' },
    ],
  },
  {
    profession: 'Видеооператор/Монтажёр',
    category: 'Медиа',
    hardSkills: [
      { name: 'Adobe Premiere Pro', level: 95, category: 'hard' },
      { name: 'After Effects', level: 85, category: 'hard' },
      { name: 'DaVinci Resolve', level: 80, category: 'hard' },
      { name: 'Освещение', level: 75, category: 'hard' },
      { name: 'Цветокоррекция', level: 80, category: 'hard' },
      { name: 'Sound Design', level: 70, category: 'hard' },
    ],
    softSkills: [
      { name: 'Креативность', level: 90, category: 'soft' },
      { name: 'Скорость работы', level: 85, category: 'soft' },
      { name: 'Внимание к деталям', level: 80, category: 'soft' },
    ],
    certifications: ['Adobe Certified Professional', 'DaVinci Resolve Certified', 'RED Camera Training'],
    courses: [
      { name: 'Видеомонтаж', provider: 'Skillbox', duration: '4 месяца' },
      { name: 'Кинооператорство', provider: 'ВГИК', duration: '4 года' },
    ],
  },
  {
    profession: 'Журналист',
    category: 'Медиа',
    hardSkills: [
      { name: 'Написание текстов', level: 95, category: 'hard' },
      { name: 'Редактирование', level: 90, category: 'hard' },
      { name: 'Интервьюирование', level: 85, category: 'hard' },
      { name: 'SMM', level: 75, category: 'hard' },
      { name: 'SEO-копирайтинг', level: 70, category: 'hard' },
      { name: 'Фотография', level: 60, category: 'hard' },
    ],
    softSkills: [
      { name: 'Коммуникабельность', level: 95, category: 'soft' },
      { name: 'Скорость', level: 85, category: 'soft' },
      { name: 'Объективность', level: 90, category: 'soft' },
    ],
    certifications: ['Журналист-практик', 'Пресс-атташе', 'SMM-специалист'],
    courses: [
      { name: 'Журналистика', provider: 'МГУ', duration: '4 года' },
      { name: 'Контент-маркетинг', provider: 'Skillbox', duration: '3 месяца' },
    ],
  },
  {
    profession: 'SMM-специалист',
    category: 'Маркетинг',
    hardSkills: [
      { name: 'Таргетинг', level: 90, category: 'hard' },
      { name: 'Контент-план', level: 85, category: 'hard' },
      { name: 'Копирайтинг', level: 95, category: 'hard' },
      { name: 'Аналитика', level: 80, category: 'hard' },
      { name: 'Видеопроизводство', level: 65, category: 'hard' },
      { name: 'Дизайн', level: 70, category: 'hard' },
    ],
    softSkills: [
      { name: 'Креативность', level: 90, category: 'soft' },
      { name: 'Коммуникация', level: 85, category: 'soft' },
      { name: 'Работа в команде', level: 80, category: 'soft' },
    ],
    certifications: ['Google Digital Garage', 'Meta Blueprint', 'TikTok Marketing'],
    courses: [
      { name: 'SMM-менеджер', provider: 'Skillbox', duration: '4 месяца' },
      { name: 'Таргетированная реклама', provider: 'Нетология', duration: '2 месяца' },
    ],
  },
  {
    profession: 'Продюсер',
    category: 'Медиа',
    hardSkills: [
      { name: 'Управление проектами', level: 95, category: 'hard' },
      { name: 'Бюджетирование', level: 90, category: 'hard' },
      { name: 'Контрактирование', level: 85, category: 'hard' },
      { name: 'Пост-продакшн', level: 75, category: 'hard' },
      { name: 'Командообразование', level: 80, category: 'hard' },
      { name: 'Сценарное мастерство', level: 70, category: 'hard' },
    ],
    softSkills: [
      { name: 'Лидерство', level: 95, category: 'soft' },
      { name: 'Коммуникация', level: 90, category: 'soft' },
      { name: 'Стрессоустойчивость', level: 85, category: 'soft' },
    ],
    certifications: ['Producer Certificate', 'EFA European Film', 'Продюсер кино и ТВ'],
    courses: [
      { name: 'Продюсирование', provider: 'ГИТР', duration: '2 года' },
      { name: 'Управление проектами', provider: 'PM Expert', duration: '6 месяцев' },
    ],
  },
  {
    profession: 'Копирайтер',
    category: 'Маркетинг',
    hardSkills: [
      { name: 'Копирайтинг', level: 95, category: 'hard' },
      { name: 'SEO-оптимизация', level: 85, category: 'hard' },
      { name: 'Редактура', level: 90, category: 'hard' },
      { name: 'Контент-маркетинг', level: 80, category: 'hard' },
      { name: 'Кейсы и брифы', level: 75, category: 'hard' },
      { name: 'Email-маркетинг', level: 70, category: 'hard' },
    ],
    softSkills: [
      { name: 'Письмо', level: 95, category: 'soft' },
      { name: 'Креативность', level: 90, category: 'soft' },
      { name: 'Исследователь', level: 80, category: 'soft' },
    ],
    certifications: ['Google Analytics', 'Content Marketing Institute', 'Copyblogger'],
    courses: [
      { name: 'Копирайтинг', provider: 'Skillbox', duration: '3 месяца' },
      { name: 'Контент-маркетинг', provider: 'Нетология', duration: '2 месяца' },
    ],
  },
  {
    profession: 'Музыкант/Звукорежиссёр',
    category: 'Музыка',
    hardSkills: [
      { name: 'DAW (Ableton/FL Studio)', level: 90, category: 'hard' },
      { name: 'Sound Design', level: 85, category: 'hard' },
      { name: 'Аранжировка', level: 80, category: 'hard' },
      { name: 'Микширование', level: 85, category: 'hard' },
      { name: 'Мастеринг', level: 75, category: 'hard' },
      { name: 'Нотная грамота', level: 70, category: 'hard' },
    ],
    softSkills: [
      { name: 'Музыкальный слух', level: 95, category: 'soft' },
      { name: 'Креативность', level: 90, category: 'soft' },
      { name: 'Терпение', level: 85, category: 'soft' },
    ],
    certifications: ['Avid Pro Tools', 'Steinberg Cubase', 'Сертификация по звуку'],
    courses: [
      { name: 'Звукорежиссура', provider: 'МИСИ', duration: '3 года' },
      { name: 'Музыкальное производство', provider: 'Skillbox', duration: '6 месяцев' },
    ],
  },
  {
    profession: 'Актер',
    category: 'Искусство',
    hardSkills: [
      { name: 'Актёрское мастерство', level: 95, category: 'hard' },
      { name: 'Сценическая речь', level: 90, category: 'hard' },
      { name: 'Пластика', level: 85, category: 'hard' },
      { name: 'Вокал', level: 75, category: 'hard' },
      { name: 'Импровизация', level: 80, category: 'hard' },
      { name: 'Работа с камерой', level: 70, category: 'hard' },
    ],
    softSkills: [
      { name: 'Эмоциональность', level: 95, category: 'soft' },
      { name: 'Эмпатия', level: 90, category: 'soft' },
      { name: 'Работоспособность', level: 85, category: 'soft' },
    ],
    certifications: ['МАРХИ актерский', 'Школа-студия МХАТ', 'Актерское мастерство'],
    courses: [
      { name: 'Актерское искусство', provider: 'Театральный институт', duration: '4 года' },
      { name: 'Ораторское мастерство', provider: 'Школа публичных выступлений', duration: '2 месяца' },
    ],
  },
  {
    profession: 'Маркетолог',
    category: 'Маркетинг',
    hardSkills: [
      { name: 'Google Analytics', level: 85, category: 'hard' },
      { name: 'SEO/SEM', level: 80, category: 'hard' },
      { name: 'Контент-маркетинг', level: 75, category: 'hard' },
      { name: 'SMM', level: 70, category: 'hard' },
      { name: 'CRM', level: 65, category: 'hard' },
      { name: 'A/B тестирование', level: 70, category: 'hard' },
    ],
    softSkills: [
      { name: 'Креативность', level: 90, category: 'soft' },
      { name: 'Коммуникация', level: 85, category: 'soft' },
      { name: 'Работа под давлением', level: 75, category: 'soft' },
    ],
    certifications: ['Google Digital Garage', 'HubSpot Inbound Marketing', 'Facebook Blueprint'],
    courses: [
      { name: 'Digital Marketing', provider: 'Google Digital Garage', duration: '40 часов' },
      { name: 'Интернет-маркетинг', provider: 'Skillbox', duration: '6 месяцев' },
    ],
  },
  {
    profession: 'Бухгалтер',
    category: 'Финансы',
    hardSkills: [
      { name: '1С:Бухгалтерия', level: 95, category: 'hard' },
      { name: 'Налоговый учет', level: 90, category: 'hard' },
      { name: 'МСФО', level: 75, category: 'hard' },
      { name: 'Финансовая отчетность', level: 85, category: 'hard' },
      { name: 'Excel ( продвинутый)', level: 80, category: 'hard' },
    ],
    softSkills: [
      { name: 'Внимательность', level: 95, category: 'soft' },
      { name: 'Ответственность', level: 90, category: 'soft' },
      { name: 'Соблюдение сроков', level: 85, category: 'soft' },
    ],
    certifications: ['ACCA', 'CIMA', 'Диплом ИПБ России'],
    courses: [
      { name: 'Бухгалтерский учет', provider: 'Высшая школа экономики', duration: '4 месяца' },
      { name: '1С:Бухгалтерия 8.3', provider: 'Специалист', duration: '3 месяца' },
    ],
  },
  {
    profession: 'Врач',
    category: 'Медицина',
    hardSkills: [
      { name: 'Клиническая диагностика', level: 90, category: 'hard' },
      { name: 'Медицинская документация', level: 85, category: 'hard' },
      { name: 'Лабораторная диагностика', level: 75, category: 'hard' },
      { name: 'Первая помощь', level: 95, category: 'hard' },
      { name: 'Фармакология', level: 80, category: 'hard' },
    ],
    softSkills: [
      { name: 'Эмпатия', level: 95, category: 'soft' },
      { name: 'Коммуникация с пациентами', level: 90, category: 'soft' },
      { name: 'Стрессоустойчивость', level: 85, category: 'soft' },
    ],
    certifications: ['Врач-специалист', 'Кандидат медицинских наук', 'Повышение квалификации'],
    courses: [
      { name: 'Клиническая практика', provider: 'Медицинский вуз', duration: '6 лет + ординатура' },
      { name: 'Телемедицина', provider: 'РМАПО', duration: '72 часа' },
    ],
  },
  {
    profession: 'Инженер',
    category: 'Инженерия',
    hardSkills: [
      { name: 'AutoCAD/SolidWorks', level: 90, category: 'hard' },
      { name: 'Техническая документация', level: 85, category: 'hard' },
      { name: 'Проектирование', level: 80, category: 'hard' },
      { name: 'Технический контроль', level: 75, category: 'hard' },
      { name: 'Знание ГОСТ/СНиП', level: 70, category: 'hard' },
    ],
    softSkills: [
      { name: 'Техническое мышление', level: 90, category: 'soft' },
      { name: 'Работа в команде', level: 80, category: 'soft' },
      { name: 'Решение проблем', level: 85, category: 'soft' },
    ],
    certifications: ['Промышленная безопасность', 'ISO 9001', 'Специалист по охране труда'],
    courses: [
      { name: 'CAD-проектирование', provider: 'Autodesk', duration: '3 месяца' },
      { name: 'Машиностроение', provider: 'Skillbox', duration: '8 месяцев' },
    ],
  },
];

interface SkillsByProfessionSectionProps {
  className?: string;
}

export function SkillsByProfessionSection({ className }: SkillsByProfessionSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfession, setSelectedProfession] = useState<ProfessionSkills | null>(professionsData[0]);

  const filteredProfessions = professionsData.filter(p => 
    p.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className={cn("py-16 bg-card", className)}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-display font-bold text-foreground">
              Навыки по профессиям
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Узнайте, какиеHard и Soft навыки, сертификации и курсы нужны для успешной карьеры в вашей сфере.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profession List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Поиск профессии..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredProfessions.map((profession) => (
                <button
                  key={profession.profession}
                  onClick={() => setSelectedProfession(profession)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-all",
                    selectedProfession?.profession === profession.profession
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 hover:bg-secondary"
                  )}
                >
                  <p className="font-medium">{profession.profession}</p>
                  <p className={cn(
                    "text-sm",
                    selectedProfession?.profession === profession.profession
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}>
                    {profession.category}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Skills Details */}
          <div className="lg:col-span-2">
            {selectedProfession && (
              <motion.div
                key={selectedProfession.profession}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {selectedProfession.profession}
                      <Badge variant="outline">{selectedProfession.category}</Badge>
                    </CardTitle>
                    <CardDescription>
                      Необходимые навыки и рекомендуемые курсы
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Hard Skills */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Code className="w-4 h-4 text-primary" />
                        Hard Skills (профессиональные)
                      </h4>
                      <div className="space-y-3">
                        {selectedProfession.hardSkills.map((skill) => (
                          <div key={skill.name} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{skill.name}</span>
                              <span className="text-muted-foreground">{skill.level}%</span>
                            </div>
                            <Progress value={skill.level} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Soft Skills */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        Soft Skills (мягкие навыки)
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProfession.softSkills.map((skill) => (
                          <Badge key={skill.name} variant="secondary" className="py-1.5">
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        Рекомендуемые сертификации
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProfession.certifications.map((cert) => (
                          <Badge key={cert} variant="outline" className="py-1.5">
                            <Check className="w-3 h-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Courses */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-primary" />
                        Рекомендуемые курсы
                      </h4>
                      <div className="space-y-2">
                        {selectedProfession.courses.map((course) => (
                          <div key={course.name} className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                            <div>
                              <p className="font-medium">{course.name}</p>
                              <p className="text-sm text-muted-foreground">{course.provider}</p>
                            </div>
                            <Badge variant="outline">{course.duration}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
