import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { FooterSection } from '@/components/sections/FooterSection';
import { MarketSection } from '@/components/sections/MarketSection';
import { AnalysisSection } from '@/components/sections/AnalysisSection';
import { CareerPathsSection } from '@/components/sections/CareerPathsSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase, TrendingUp, Target, Award, ChevronRight, Star, MapPin, 
   BookOpen, Users, Award as Trophy, BarChart3, Zap,
  Search, Shield, Code, Palette, Brain, Building2, GraduationCap, 
  Lightbulb, Workflow, GitBranch, Server, Stethoscope, PenTool
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

interface StudentsProps {
  isChatOpen?: boolean;
  onChatToggle?: (open: boolean) => void;
}

// Profession icons for visual enhancement (static)
const professionIcons: Record<string, LucideIcon> = {
  "Frontend-разработчик": Code,
  "Data Scientist": Brain,
  "UX/UI-дизайнер": Palette,
  "DevOps-инженер": Zap,
  "Мобильный разработчик": Code,
  "Системный администратор": Server,
  "Бизнес-аналитик": Workflow,
  "QA-инженер": Target,
  "Менеджер проектов": GitBranch,
  "Специалист по кибербезопасности": Shield,
  "Маркетолог": Lightbulb,
  "Финансовый аналитик": BarChart3,
  "Гражданский инженер": Building2,
  "Преподаватель университета": GraduationCap,
  "Врач-терапевт": Stethoscope,
  "Архитектор": PenTool,
};

// Profession category colors for visual distinction
const categoryColors: Record<string, string> = {
  "IT & Разработка": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "Данные & Аналитика": "bg-purple-500/10 text-purple-600 border-purple-500/20",
  "Дизайн & UX": "bg-pink-500/10 text-pink-600 border-pink-500/20",
  "Безопасность": "bg-red-500/10 text-red-600 border-red-500/20",
  "Менеджмент & Бизнес": "bg-green-500/10 text-green-600 border-green-500/20",
  "Финансы & Экономика": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "Инженерия & Техника": "bg-orange-500/10 text-orange-600 border-orange-500/20",
  "Образование & Наука": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "Маркетинг & Коммуникации": "bg-teal-500/10 text-teal-600 border-teal-500/20",
  "Медицина & Здравоохранение": "bg-rose-500/10 text-rose-600 border-rose-500/20",
  "Архитектура & Строительство": "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
};

// All professions data - RUSSIAN NAMES (16 professions across all spheres) - static constant
const ALL_PROFESSIONS = [
  {
    title: "Frontend-разработчик",
    category: "IT & Разработка",
    description: "Создает пользовательские интерфейсы для веб-приложений. Работает с HTML, CSS, JavaScript и фреймворками (React, Vue.js, Angular).",
    careerPath: "Стажер → Junior → Middle → Senior → Lead → Architect",
    keySkills: {
      hard: ["HTML5/CSS3", "JavaScript/TypeScript", "React/Vue/Angular", "Git", "Тестирование"],
      soft: ["Коммуникация", "Работа в команде", "Управление временем", "Критическое мышление"]
    },
    skillLevels: {
      hard: [
        { skill: "JavaScript/TypeScript", level: 95 },
        { skill: "React/Vue", level: 90 },
        { skill: "CSS/SCSS", level: 85 },
        { skill: "Git", level: 80 },
        { skill: "Английский язык", level: 75 }
      ],
      soft: [
        { skill: "Коммуникация", level: 85 },
        { skill: "Работа в команде", level: 90 },
        { skill: "Управление временем", level: 80 },
        { skill: "Критическое мышление", level: 88 }
      ]
    },
    improvementAreas: ["Углубление в TypeScript", "Оптимизация производительности", "Архитектура приложений", "Mentorship"],
    education: ["ВУЗ: компьютерные науки", "Курсы веб-разработки", "Буткемпы", "Онлайн-платформы (Hexlet, Coursera)"],
    salary: {
      average: 3400,
      range: "1700 - 6000 BYN",
      growth: "+15% в год"
    },
     prospects: "Высокий спрос. Возможность удаленной/офлайн работы, рост до архитектора или техлида. Широкие возможности в стартапах и крупных компаниях.",
    relevance: "Средне актуально. Очень высокая конкуренция. Рынок переполнен. Frontend быстро развивается с новыми инструментами (React Server Components, Vite). ",
    marketDemand: "Очень высокий",
     location: "удаленно/офлайн"
  },
  {
    title: "Data Scientist",
    category: "Данные & Аналитика",
    description: "Анализирует большие данные, строит предиктивные модели с помощью машинного обучения. Извлекает бизнес-инсайты из данных.",
    careerPath: "Стажер → Junior → Data Scientist → Senior → Lead → Head of DS",
    keySkills: {
      hard: ["Python (pandas, scikit-learn)", "Машинное обучение", "SQL", "Статистика", "Big Data (Spark)"],
      soft: ["Аналитическое мышление", "Визуализация данных", "Презентации", "Бизнес-аналитика"]
    },
    skillLevels: {
      hard: [
        { skill: "Python", level: 98 },
        { skill: "ML алгоритмы", level: 95 },
        { skill: "SQL", level: 85 },
        { skill: "Статистика", level: 80 },
        { skill: "Big Data (Spark)", level: 78 }
      ],
      soft: [
        { skill: "Аналитическое мышление", level: 92 },
        { skill: "Визуализация данных", level: 85 },
        { skill: "Презентации", level: 80 },
        { skill: "Бизнес-аналитика", level: 82 }
      ]
    },
    improvementAreas: ["Глубокое изучение ML", "Облачные платформы (AWS, GCP)", "Специализация (NLP, CV)", "Менеджмент"],
    education: ["ВУЗ: математика/физика/информатика", "Магистратура по Data Science", "Сертификации AWS ML", "Coursera/Kaggle"],
    salary: {
      average: 2800,
      range: "2200 - 3800 BYN",
      growth: "+22% в год"
    },
    prospects: "Очень высокий спрос в IT, банках, финтехе, но большая конкуренция. Работа над AI-проектами. Рост до Chief Data Officer.",
    relevance: "Крайне актуально. Data Science и AI — фундамент цифровой трансформации.",
    marketDemand: "Очень высокий",
     location: "удаленно/офлайн"
  },
  {
    title: "UX/UI-дизайнер",
    category: "Дизайн & UX",
    description: "Создает удобные и визуально привлекательные интерфейсы для цифровых продуктов. Фокусируется на пользовательском опыте.",
    careerPath: "Стажер → Junior → Middle → Senior → Lead → Design Director",
    keySkills: {
      hard: ["Figma/Sketch", "User Research", "Прототипирование", "Визуальный дизайн", "Дизайн-системы"],
      soft: ["Критическое мышление", "Креативность", "Эмпатия", "Презентации"]
    },
    skillLevels: {
      hard: [
        { skill: "Figma/Sketch", level: 95 },
        { skill: "User Research", level: 90 },
        { skill: "Прототипирование", level: 85 },
        { skill: "Визуальный дизайн", level: 88 },
        { skill: "Дизайн-системы", level: 82 }
      ],
      soft: [
        { skill: "Критическое мышление", level: 85 },
        { skill: "Креативность", level: 92 },
        { skill: "Эмпатия", level: 88 },
        { skill: "Презентации", level: 80 }
      ]
    },
    improvementAreas: ["Новые инструменты (Framer)", "UX-исследования", "Motion design", "Мобильный дизайн"],
    education: ["ВУЗ: дизайн, графика", "Курсы Google UX Design", "Буткемпы", "Конференции (Awwwards)"],
     salary: {
       average: 2400,
       range: "1400 - 2400 BYN",
       growth: "+12% в год"
     },
    prospects: "Растущий спрос в IT и агентствах. Возможность работать над глобальными продуктами. Перспектива стать CDO.",
    relevance: "Актуально. UX становится ключевым фактором успеха продуктов. Высокая конкуренция. ",
    marketDemand: "Высокий",
     location: "удаленно/офлайн",
    skillImportance: [
      { skill: "Figma", importance: 98 },
      { skill: "User Research", importance: 90 },
      { skill: "UI-дизайн", importance: 88 },
      { skill: "Прототипирование", importance: 85 },
      { skill: "Креативность", importance: 80 },
      { skill: "Критическое мышление", importance: 75 }
    ]
  },
  {
    title: "DevOps-инженер",
    category: "IT & Разработка",
    description: "Автоматизирует процессы разработки и развертывания (CI/CD). Обеспечивает стабильность, масштабируемость и безопасность инфраструктуры.",
    careerPath: "Стажер → Junior → DevOps → Senior → Architect → SRE",
    keySkills: {
      hard: ["Docker", "Kubernetes", "CI/CD", "Облака (AWS/GCP/Azure)", "Linux", "IaC (Terraform)"],
      soft: ["Решаение проблем", "Автоматизация", "Документация", "Командная работа"]
    },
    skillLevels: {
      hard: [
        { skill: "Kubernetes", level: 95 },
        { skill: "Docker", level: 93 },
        { skill: "CI/CD", level: 90 },
        { skill: "Облачные платформы", level: 88 },
        { skill: "Linux", level: 85 },
        { skill: "Terraform", level: 80 }
      ],
      soft: [
        { skill: "Решение проблем", level: 92 },
        { skill: "Автоматизация", level: 90 },
        { skill: "Документация", level: 85 },
        { skill: "Командная работа", level: 88 }
      ]
    },
    improvementAreas: ["Облачная безопасность (DevSecOps)", "Новые инструменты", "SRE практики", "Менеджмент"],
    education: ["ВУЗ: IT/системное администрирование", "Сертификации (CKA, AWS)", "Курсы (Linux Academy)", "Практический опыт"],
    salary: {
      average: 3300,
      range: "2200 - 7200 BYN",
      growth: "+18% в год"
    },
    prospects: "Очень высокий спрос. DevOps — стандарт современной разработки. Возможность работать в международных компаниях.",
    relevance: "Очень актуально. Автоматизация, облака и микросервисы — будущее IT.",
    marketDemand: "Очень высокий",
     location: "удаленно/офлайн",
    skillImportance: [
      { skill: "Kubernetes", importance: 95 },
      { skill: "Docker", importance: 93 },
      { skill: "CI/CD", importance: 90 },
      { skill: "Облачные платформы", importance: 88 },
      { skill: "Linux", importance: 85 },
      { skill: "Terraform", importance: 80 }
    ]
  },
  {
    title: "Мобильный разработчик (iOS/Android)",
    category: "IT & Разработка",
    description: "Разрабатывает нативные и кроссплатформенные мобильные приложения для iOS и Android. Создает удобные и производительные решения.",
    careerPath: "Стажер → Junior → Middle → Senior → Lead → Architect",
    keySkills: {
      hard: ["Swift (iOS) / Kotlin (Android)", "React Native", "Flutter", "API интеграция", "Тестирование"],
      soft: ["Адаптивность", "Внимание к деталям", "Коммуникация", "Управление временем"]
    },
    skillLevels: {
      hard: [
        { skill: "Swift/Kotlin", level: 90 },
        { skill: "React Native/Flutter", level: 85 },
        { skill: "iOS/Android SDK", level: 88 },
        { skill: "UI/UX principles", level: 80 },
        { skill: "API Integration", level: 85 },
        { skill: "Performance optimization", level: 75 }
      ],
      soft: [
        { skill: "Адаптивность", level: 88 },
        { skill: "Внимание к деталям", level: 90 },
        { skill: "Коммуникация", level: 85 },
        { skill: "Управление временем", level: 82 }
      ]
    },
    improvementAreas: ["Кроссплатформенные технологии", "Мобильная безопасность", "AR/VR разработка", "Оптимизация"],
    education: ["ВУЗ: компьютерные науки", "Курсы (Udacity, Ray Wenderlich)", "Сертификации Apple/Google"],
    salary: {
      average: 2500,
      range: "1300 - 4000 BYN",
      growth: "+16% в год"
    },
    prospects: "Высокий спрос на мобильные приложения. Возможность работать над топовыми продуктами, выход на международный рынок.",
    relevance: "Очень актуально. Мобильные приложения — основной канал взаимодействия с пользователями.",
    marketDemand: "Высокий",
     location: "удаленно/офлайн",
    skillImportance: [
      { skill: "Swift/Kotlin", importance: 90 },
      { skill: "React Native/Flutter", importance: 85 },
      { skill: "iOS/Android SDK", importance: 88 },
      { skill: "UI/UX principles", importance: 80 },
      { skill: "API Integration", importance: 85 },
      { skill: "Performance optimization", importance: 75 }
    ]
  },
  {
    title: "Системный администратор",
    category: "Инженерия & Техника",
    description: "Обслуживает и поддерживает компьютерные сети, серверы, рабочие станции. Обеспечивает безопасность и бесперебойную работу IT-инфраструктуры.",
    careerPath: "Младший → Администратор → Senior → IT-менеджер → IT-директор",
    keySkills: {
      hard: ["Linux/Windows Server", "Сети (TCP/IP, DNS, DHCP)", "Безопасность", "Виртуализация", "Скриптинг"],
      soft: ["Реакция на инциденты", "Документация", "Планирование", "Коммуникация"]
    },
    skillLevels: {
      hard: [
        { skill: "Linux/Windows", level: 90 },
        { skill: "Сети", level: 88 },
        { skill: "Безопасность", level: 85 },
        { skill: "Скриптинг (Bash/PowerShell)", level: 80 },
        { skill: "Виртуализация", level: 75 }
      ],
      soft: [
        { skill: "Реакция на инциденты", level: 90 },
        { skill: "Документация", level: 82 },
        { skill: "Планирование", level: 80 },
        { skill: "Коммуникация", level: 85 }
      ]
    },
    improvementAreas: ["Глубокие знания сетей", "Кибербезопасность", "DevOps инструменты", "Облачные технологии"],
    education: ["ВУЗ: IT/телеммуникации", "Сертификации (Cisco CCNA, RHCSA)", "Курсы системного администрирования"],
    salary: {
      average: 2300,
      range: "1300 - 4600 BYN",
      growth: "+15% в год"
    },
    prospects: "Стабильный спрос во всех компаниях. Возможность роста до IT-менеджера или перехода в DevOps/Кибербезопасность.",
    relevance: "Актуально. Без поддержки инфраструктуры не работает ни один бизнес.",
    marketDemand: "Средний",
    location: "Офлайн",
    skillImportance: [
      { skill: "Linux/Windows", importance: 90 },
      { skill: "Сети", importance: 88 },
      { skill: "Безопасность", importance: 85 },
      { skill: "Скриптинг (Bash/PowerShell)", importance: 80 },
      { skill: "Виртуализация", importance: 75 },
      { skill: "Документация", importance: 70 }
    ]
  },
  {
    title: "Бизнес-аналитик",
    category: "Менеджмент & Бизнес",
    description: "Анализирует бизнес-процессы, собирает требования, выступает посредником между бизнесом и IT. Оптимизирует эффективность бизнеса.",
    careerPath: "Младший → Бизнес-аналитик → Senior → Lead → Product Owner/Manager",
    keySkills: {
      hard: ["Сбор требований", "BPMN", "Анализ данных", "Документирование", "Agile/Scrum"],
      soft: ["Коммуникация", "Переговоры", "Презентации", "Критическое мышление"]
    },
    skillLevels: {
      hard: [
        { skill: "Сбор требований", level: 95 },
        { skill: "BPMN", level: 85 },
        { skill: "Анализ данных", level: 88 },
        { skill: "Документирование", level: 80 },
        { skill: "Agile/Scrum", level: 85 }
      ],
      soft: [
        { skill: "Коммуникация", level: 90 },
        { skill: "Переговоры", level: 88 },
        { skill: "Презентации", level: 85 },
        { skill: "Критическое мышление", level: 92 }
      ]
    },
    improvementAreas: ["Углубление в бизнес-процессы", "Agile сертификации", "Data analysis", "Специализация в отрасли"],
    education: ["ВУЗ: экономика/менеджмент", "Сертификации (IIBA CBAP, PMI-PBA)", "Курсы бизнес-аналитики", "MBA"],
    salary: {
      average: 3100,
      range: "1000 - 6400 BYN",
      growth: "+12% в год"
    },
    prospects: "Высокий спрос в IT, банках, консалтинге. Возможность роста до Product Manager или в менеджмент.",
    relevance: "Очень актуально. Бизнес-аналитики — ключевые фигуры в цифровой трансформации организаций.",
    marketDemand: "Высокий",
     location: "удаленно/офлайн",
    skillImportance: [
      { skill: "Сбор требований", importance: 95 },
      { skill: "BPMN", importance: 85 },
      { skill: "Анализ данных", importance: 88 },
      { skill: "Agile/Scrum", importance: 85 },
      { skill: "Коммуникация", importance: 90 },
      { skill: "Документирование", importance: 80 }
    ]
  },
  {
    title: "QA-инженер (Тестировщик)",
    category: "IT & Разработка",
    description: "Тестирует программное обеспечение для обеспечения качества. Выявляет дефекты, автоматизирует тесты, работает с разными типами тестирования.",
    careerPath: "Младший → QA-инженер → Senior → Lead → Manager / Автоматизатор",
    keySkills: {
      hard: ["Тест-дизайн", "Автоматизация (Selenium/Cypress)", "Баг-трекинг", "Тестирование производительности", "Agile/Scrum"],
      soft: ["Внимание к деталям", "Критическое мышление", "Коммуникация", "Управление временем"]
    },
    skillLevels: {
      hard: [
        { skill: "Тест-дизайн", level: 90 },
        { skill: "Автоматизация тестирования", level: 88 },
        { skill: "SQL", level: 75 },
        { skill: "Agile/Scrum", level: 80 },
        { skill: "Баг-трекинг", level: 85 }
      ],
      soft: [
        { skill: "Внимание к деталям", level: 92 },
        { skill: "Критическое мышление", level: 88 },
        { skill: "Коммуникация", level: 80 },
        { skill: "Управление временем", level: 82 }
      ]
    },
    improvementAreas: ["Автоматизация (Java/Python)", "Тестирование безопасности", "CI/CD интеграция", "Специализация (API, mobile)"],
    education: ["ВУЗ: информатика/ПО инженерия", "Курсы тестирования (Software-Testing.ru)", "Сертификации (ISTQB)"],
    salary: {
      average: 2300,
      range: "1000 - 4000 BYN",
      growth: "+12% в год"
    },
    prospects: "Стабильный спрос в IT-секторе. Возможность роста до Lead QA или перехода в DevOps/Development.",
    relevance: "Актуально. Качество ПО критически важно для пользовательского доверия.",
    marketDemand: "Средний",
     location: "удаленно/офлайн",
    skillImportance: [
      { skill: "Тест-дизайн", importance: 90 },
      { skill: "Автоматизация тестирования", importance: 88 },
      { skill: "SQL", importance: 75 },
      { skill: "Agile/Scrum", importance: 80 },
      { skill: "Внимание к деталям", importance: 85 },
      { skill: "Коммуникация", importance: 75 }
    ]
  },
  {
    title: "Менеджер проектов",
    category: "Менеджмент & Бизнес",
    description: "Управляет проектами: планирует сроки, бюджет, ресурсы. Обеспечивает выполнение проектов и удовлетворенность заказчиков.",
    careerPath: "Ассистент → Менеджер → Senior → Program Manager → Директор по проектам",
    keySkills: {
      hard: ["Планирование (MS Project)", "Управление рисками", "Бюджетирование", "Agile/Scrum/Kanban", "Отчетность"],
      soft: ["Лидерство", "Коммуникация", "Переговоры", "Решение проблем", "Стратегическое мышление"]
    },
    skillLevels: {
      hard: [
        { skill: "Планирование", level: 90 },
        { skill: "Управление рисками", level: 88 },
        { skill: "Agile/Scrum", level: 85 },
        { skill: "Бюджетирование", level: 80 },
        { skill: "Отчетность", level: 82 }
      ],
      soft: [
        { skill: "Лидерство", level: 88 },
        { skill: "Коммуникация", level: 92 },
        { skill: "Переговоры", level: 90 },
        { skill: "Решение проблем", level: 85 },
        { skill: "Стратегическое мышление", level: 80 }
      ]
    },
    improvementAreas: ["Agile методологии (CSM, PMI-ACP)", "Управление изменениями", "Сертификации (PMP, PRINCE2)", "Специализация в отрасли"],
    education: ["ВУЗ: менеджмент/MBA", "Сертификации PMP, PRINCE2", "Курсы управления проектами"],
    salary: {
      average: 2200,
      range: "1600 - 4800 BYN",
      growth: "+14% в год"
    },
    prospects: "Высокий спрос в IT и других отраслях. Возможность роста до Program Manager или директора по проектам.",
    relevance: "Очень актуально. Эффективное управление проектами критически важно для бизнеса.",
    marketDemand: "Высокий",
     location: "удаленно/офлайн",
    skillImportance: [
      { skill: "Планирование", importance: 90 },
      { skill: "Управление рисками", importance: 88 },
      { skill: "Agile/Scrum", importance: 85 },
      { skill: "Бюджетирование", importance: 80 },
      { skill: "Коммуникация", importance: 92 },
      { skill: "Лидерство", importance: 85 }
    ]
  },
  {
    title: "Специалист по кибербезопасности",
    category: "Безопасность",
    description: "Защищает информационные системы, сети и данные от кибератак и утечек. Работает с безопасностью приложений, сетей и инфраструктуры.",
    careerPath: "Младший → Security Analyst → Security Engineer → Senior → Security Architect / CISO",
    keySkills: {
      hard: ["Сетевая безопасность", "Ethical Hacking", "SIEM/WAF", "Оценка рисков", "Реагирование на инциденты"],
      soft: ["Аналитическое мышление", "Этика", "Коммуникация", "Управление кризисами"]
    },
    skillLevels: {
      hard: [
        { skill: "Сетевая безопасность", level: 95 },
        { skill: "Ethical Hacking", level: 90 },
        { skill: "SIEM/IDS/IPS", level: 88 },
        { skill: "Криптография", level: 80 },
        { skill: "Реагирование на инциденты", level: 85 }
      ],
      soft: [
        { skill: "Аналитическое мышление", level: 90 },
        { skill: "Этика", level: 88 },
        { skill: "Коммуникация", level: 82 },
        { skill: "Управление кризисами", level: 85 }
      ]
    },
    improvementAreas: ["Облачная безопасность", "Сертификации (CISSP, CEH, OSCP)", "Изучение регуляций", "APT анализ"],
    education: ["ВУЗ: информационная безопасность", "Сертификации (CISSP, CEH)", "Курсы (Offensive Security)", "CTF-соревнования"],
    salary: {
      average: 3000,
      range: "2000 - 6000 BYN",
      growth: "+18% в год"
    },
    prospects: "Очень высокий спрос. Киберугрозы растут, безопасность становится приоритетом. Высокие зарплаты, работа в международных командах.",
    relevance: "Крайне актуально. Кибербезопасность — критическая компетенция в эпоху цифровизации.",
    marketDemand: "Очень высокий",
    location: "Офлайн",
    skillImportance: [
      { skill: "Сетевая безопасность", importance: 95 },
      { skill: "Ethical Hacking", importance: 90 },
      { skill: "SIEM/IDS/IPS", importance: 88 },
      { skill: "Криптография", importance: 80 },
      { skill: "Реагирование на инциденты", importance: 85 },
      { skill: "Аналитическое мышление", importance: 80 }
    ]
  },
  {
    title: "Маркетолог",
    category: "Маркетинг & Коммуникации",
    description: "Разрабатывает маркетинговые стратегии, продвигает продукты, анализирует рынок и конкурентов. Работает с цифровыми каналами и аналитикой.",
    careerPath: "Стажер → Маркетолог → Senior → Marketing Manager → Marketing Director → CMO",
    keySkills: {
      hard: ["Digital Marketing (SEO, SEM, SMM)", "Google Analytics", "CRM-системы", "Email-маркетинг", "Медиа-планирование"],
      soft: ["Креативность", "Аналитическое мышление", "Коммуникация", "Стратегическое планирование"]
    },
    skillLevels: {
      hard: [
        { skill: "Digital Marketing", level: 92 },
        { skill: "Google Analytics", level: 90 },
        { skill: "Контент-маркетинг", level: 85 },
        { skill: "SMM", level: 83 },
        { skill: "CRM-системы", level: 80 }
      ],
      soft: [
        { skill: "Креативность", level: 90 },
        { skill: "Анализ данных", level: 88 },
        { skill: "Коммуникация", level: 85 },
        { skill: "Стратегическое планирование", level: 82 }
      ]
    },
    improvementAreas: ["Data-driven маркетинг", "Новые платформы и алгоритмы", "Видео-сторителлинг", "SMM и Influencer Marketing"],
    education: ["ВУЗ: маркетинг/реклама", "Сертификации Google/Facebook", "Курсы (Coursera, Skillbox)", "Онлайн-платформы"],
    salary: {
      average: 2300,
      range: "1600 - 4100 BYN",
      growth: "+12% в год"
    },
    prospects: "Высокий спрос на цифровых маркетологов. Возможность роста до CMO или запуска собственного агентства.",
    relevance: "Очень актуально. Маркетинг постоянно меняется с новыми платформами и технологиями.",
    marketDemand: "Высокий",
     location: "удаленно/офлайн",
    skillImportance: [
      { skill: "Digital Marketing", importance: 92 },
      { skill: "Google Analytics", importance: 90 },
      { skill: "Контент-маркетинг", importance: 85 },
      { skill: "SMM", importance: 83 },
      { skill: "Креативность", importance: 80 },
      { skill: "Анализ данных", importance: 78 }
    ]
  },
  {
    title: "Финансовый аналитик",
    category: "Финансы & Экономика",
    description: "Анализирует финансовые данные, строит модели, готовит отчетность, оценивает инвестиции. Поддерживает управленческие решения.",
    careerPath: "Младший аналитик → Финансовый аналитик → Senior → Finance Manager → Financial Controller / CFO",
    keySkills: {
      hard: ["Финансовый анализ", "Excel (продвинутый)", "SQL", "Финансовое моделирование", "Power BI/Tableau"],
      soft: ["Внимание к деталям", "Презентации", "Бизнес-аналитика", "Этичность"]
    },
    skillLevels: {
      hard: [
        { skill: "Excel (продвинутый)", level: 95 },
        { skill: "Финансовый анализ", level: 92 },
        { skill: "Финансовое моделирование", level: 90 },
        { skill: "SQL", level: 80 },
        { skill: "Power BI/Tableau", level: 78 }
      ],
      soft: [
        { skill: "Внимание к деталям", level: 90 },
        { skill: "Презентации", level: 85 },
        { skill: "Бизнес-аналитика", level: 88 },
        { skill: "Этичность", level: 95 }
      ]
    },
    improvementAreas: ["Сертификации (CFA, CMA)", "Корпоративные финансы и M&A", "Risk-менеджмент", "Экономические исследования"],
     education: ["ВУЗ: финансы/экономика", "Магистратура/MBA", "Сертификации (CFA, CMA)", "Курсы финансового моделирования"],
     salary: {
       average: 2400,
       range: "1200 - 5300 BYN",
       growth: "+14% в год"
     },
    prospects: "Стабильный спрос в банках, инвестиционных компаниях, корпорациях. Рост до финансового директора (CFO).",
    relevance: "Очень актуально. Финансовый анализ — основа для стратегических решений.",
    marketDemand: "Высокий",
     location: "удаленно/офлайн",
    skillImportance: [
      { skill: "Excel (продвинутый)", importance: 95 },
      { skill: "Финансовый анализ", importance: 92 },
      { skill: "Финансовое моделирование", importance: 90 },
      { skill: "SQL", importance: 80 },
      { skill: "Power BI/Tableau", importance: 78 },
      { skill: "Внимание к деталям", importance: 85 }
    ]
  },
  {
    title: "Гражданский инженер",
    category: "Инженерия & Техника",
    description: "Проектирует, строит и контролирует инфраструктурные объекты: здания, дороги, мосты, ЖКХ. Обеспечивает безопасность и качество.",
    careerPath: "Младший инженер → Инженер → Старший → Lead Engineer / Прораб → Project Manager",
    keySkills: {
      hard: ["AutoCAD/Revit (BIM)", "Проектирование", "Строительные нормы", "Управление проектами", "Сметы"],
      soft: ["Лидерство", "Организация", "Безопасность", "Коммуникация с подрядчиками"]
    },
    skillLevels: {
      hard: [
        { skill: "AutoCAD/Revit", level: 93 },
        { skill: "Строительные нормы", level: 90 },
        { skill: "Управление проектами", level: 85 },
        { skill: "Контроль качества", level: 88 },
        { skill: "Сметное дело", level: 80 }
      ],
      soft: [
        { skill: "Лидерство", level: 85 },
        { skill: "Организация", level: 88 },
        { skill: "Безопасность", level: 90 },
        { skill: "Коммуникация с подрядчиками", level: 82 }
      ]
    },
    improvementAreas: ["Сертификации по BIM", "Экологические нормы", "Управление бригадами", "Новые материалы и технологии"],
    education: ["ВУЗ: строительство/архитектура", "Сертификации BIM Manager", "Курсы повышения квалификации"],
    salary: {
      average: 2200,
      range: "1400 - 3900 BYN",
      growth: "+12% в год"
    },
    prospects: "Стабильный спрос в строительной отрасли и госинфраструктурных проектах. Работа в проектных организациях.",
    relevance: "Актуально. Инфраструктурное развитие и реновация остаются приоритетом.",
    marketDemand: "Средний",
    location: "Офлайн",
    skillImportance: [
      { skill: "AutoCAD/Revit", importance: 93 },
      { skill: "Строительные нормы", importance: 90 },
      { skill: "Управление проектами", importance: 85 },
      { skill: "Контроль качества", importance: 88 },
      { skill: "Сметное дело", importance: 80 },
      { skill: "Безопасность", importance: 85 }
    ]
  },
  {
    title: "Преподаватель университета / Научный сотрудник",
    category: "Образование & Наука",
    description: "Ведет учебные курсы, проводит научные исследования, публикует работы, готовит материалы и наставляет студентов.",
    careerPath: "Преподаватель → Доцент → Профессор → Зав. кафедрой / Декан",
    keySkills: {
      hard: ["Академическое преподавание", "Научные исследования", "Публикации", "Разработка программ", "Грантовая деятельность"],
      soft: ["Публичные выступления", "Наставничество", "Критическое мышление", "Международное сотрудничество"]
    },
    skillLevels: {
      hard: [
        { skill: "Академическое преподавание", level: 92 },
        { skill: "Научные исследования", level: 90 },
        { skill: "Публикации", level: 88 },
        { skill: "Грантовая деятельность", level: 80 },
        { skill: "Разработка программ", level: 82 }
      ],
      soft: [
        { skill: "Публичные выступления", level: 85 },
        { skill: "Наставничество", level: 90 },
        { skill: "Критическое мышление", level: 88 },
        { skill: "Международное сотрудничество", level: 80 }
      ]
    },
      improvementAreas: ["Публикация в международных журналах", "Привлечение грантов", "Современные педагогические технологии", "Международные стажировки"],
      education: ["Ученая степень (кандидат/доктор)", "Аспирантура", "Повышение квалификации", "Стажировки за рубежом"],
      salary: {
        average: 1000,
        range: "800 - 1800 BYN",
        growth: "+6% в год"
      },
    prospects: "Престижная карьера с возможностью исследований. Рост в академической иерархии или переход в администрацию.",
    relevance: "Крайне актуально. Образование и наука — основа развития общества. Острая нехватка учителей.",
    marketDemand: "Очень высокий",
    location: "Офлайн",
    skillImportance: [
      { skill: "Академическое преподавание", importance: 92 },
      { skill: "Научные исследования", importance: 90 },
      { skill: "Публикации", importance: 88 },
      { skill: "Грантовая деятельность", importance: 80 },
      { skill: "Наставничество", importance: 85 },
      { skill: "Публичные выступления", importance: 78 }
    ]
  },
  {
    title: "Врач-терапевт",
    category: "Медицина & Здравоохранение",
    description: "Диагностирует и лечит заболевания, проводит профилактические осмотры, составляет планы лечения. Работает с пациентами всех возрастов.",
    careerPath: "Интерн → Врач-терапевт → participant → Заведующий отделением → Главный врач",
     keySkills: {
       hard: ["Диагностика", "Клинические навыки", "Фармакология", "Медицинская документация", "ЭКГ, анализы"],
       soft: ["Эмпатия", "Коммуникация с пациентами", "Стрессоустойчивость", "Этика", "Работа в команде"]
     },
     skillLevels: {
       hard: [
         { skill: "Диагностика", level: 95 },
         { skill: "Клинические навыки", level: 93 },
         { skill: "Фармакология", level: 88 },
         { skill: "Медицинская документация", level: 85 },
         { skill: "ЭКГ, анализы", level: 80 }
       ],
       soft: [
         { skill: "Эмпатия", level: 90 },
         { skill: "Коммуникация с пациентами", level: 88 },
         { skill: "Стрессоустойчивость", level: 85 },
         { skill: "Этика", level: 82 },
         { skill: "Работа в команде", level: 80 }
       ]
     },
     improvementAreas: ["Специализация (кардиология, неврология)", "Углубление в диагностику", "Soft skills для коммуникации", "Изучение новых методов лечения"],
    education: ["ВУЗ: медицина (лечебный факультет)", "Интернатура/ординатура", "Сертификации специализаций", "Повышение квалификации"],
    salary: {
      average: 1800,
      range: "1200 - 4100 BYN",
      growth: "+12% в год"
    },
    prospects: "Очень высокий спрос. Стабильная профессия с высоким социальным статусом. Возможность частной практики.",
    relevance: "Постоянно актуально. Здравоохранение всегда в приоритете.",
    marketDemand: "Очень высокий",
    location: "Офлайн",
    skillImportance: [
      { skill: "Диагностика", importance: 95 },
      { skill: "Клинические навыки", importance: 93 },
      { skill: "Фармакология", importance: 88 },
      { skill: "Эмпатия", importance: 90 },
      { skill: "Коммуникация с пациентами", importance: 85 },
      { skill: "Стрессоустойчивость", importance: 85 }
    ]
  },
  {
    title: "Архитектор",
    category: "Архитектура & Строительство",
    description: "Проектирует здания и сооружения, разрабатывает архитектурные концепции, составляет документацию. Работает с клиентами и инженерами.",
    careerPath: "Стажер → Архитектор → Senior Architect → Lead Architect → Практикующий архитектор / Директор",
     keySkills: {
       hard: ["AutoCAD/Revit/ArchiCAD", "3D- моделирование (3ds Max, SketchUp)", "Построение планов", "Нормы и стандарты", "Управление проектами"],
       soft: ["Креативность", "Коммуникация с клиентами", "Внимание к деталям", "Лидерство", "Экологическое мышление"]
     },
     skillLevels: {
       hard: [
         { skill: "AutoCAD/Revit/ArchiCAD", level: 95 },
         { skill: "3D-моделирование (3ds Max)", level: 90 },
         { skill: "Строительные нормы и стандарты", level: 88 },
         { skill: "Управление проектами", level: 85 },
         { skill: "Экологическое проектирование", level: 80 }
       ],
       soft: [
         { skill: "Креативность", level: 92 },
         { skill: "Коммуникация с клиентами", level: 88 },
         { skill: "Внимание к деталям", level: 90 },
         { skill: "Лидерство", level: 82 },
         { skill: "Экологическое мышление", level: 85 }
       ]
     },
      improvementAreas: ["BIM технологии", "Экологичное и энергоэффективное строительство", "Управление проектами", "Новые материалы и технологии"],
     education: ["ВУЗ: архитектура", "Лицензия архитектора", "Сертификации (BIM, LEED)", "Курсы повышения квалификации"],
     salary: {
       average: 3000,
       range: "1300 - 4300 BYN",
       growth: "+15% в год"
     },
    prospects: "Умеренный спрос, но высокая конкуренция. Возможность частной практики, работы в международных бюро.",
    relevance: "Актуально. Градостроительство, реновация и энергоэффективность на пике.",
    marketDemand: "Средний",
     location: "удаленно/офлайн",
    skillImportance: [
      { skill: "AutoCAD/Revit", importance: 95 },
      { skill: "3D-моделирование", importance: 88 },
      { skill: "Креативность", importance: 90 },
      { skill: "Строительные нормы", importance: 85 },
      { skill: "Коммуникация с клиентами", importance: 82 },
      { skill: "Управление проектами", importance: 80 }
    ]
  }
];

// Tabs configuration
const TABS = [
  { id: 'overview', label: 'Обзор', icon: Briefcase },
  { id: 'career', label: 'Карьера', icon: Trophy },
  { id: 'skills', label: 'Навыки', icon: Target },
  { id: 'education', label: 'Образование', icon: BookOpen },
  { id: 'salary', label: 'Зарплата', icon: Trophy },
  { id: 'prospects', label: 'Перспективы', icon: TrendingUp },
];

const Students = ({ isChatOpen = false }: StudentsProps) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedProfession, setSelectedProfession] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();

   // Filtered professions based on search - memoized for performance
   const filteredProfessions = useMemo(() => {
     if (!searchQuery.trim()) return ALL_PROFESSIONS;
     
     const query = searchQuery.toLowerCase();
     return ALL_PROFESSIONS.filter(p => 
       p.title.toLowerCase().includes(query) ||
       p.category.toLowerCase().includes(query) ||
       p.description.toLowerCase().includes(query) ||
       (p.keySkills && p.keySkills.hard && p.keySkills.hard.some(skill => skill.toLowerCase().includes(query))) ||
       (p.keySkills && p.keySkills.soft && p.keySkills.soft.some(skill => skill.toLowerCase().includes(query)))
     );
   }, [searchQuery]);

  const selectedProfessionData = ALL_PROFESSIONS.find(p => p.title === selectedProfession);

  return (
    <div className="min-h-screen bg-background">
      <Header activeSection={activeSection} onSectionChange={setActiveSection} chatOpen={isChatOpen} />
      
      <motion.main
        animate={{
          marginRight: isChatOpen ? '450px' : '0px'
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative"
      >
        {/* Hero Section for Students */}
        <section className="pt-24 pb-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Briefcase className="w-5 h-5" />
                <span className="text-sm font-medium">{t('students.badge')}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
                {t('students.title')}
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                {t('students.subtitle')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="card-elevated p-6 text-left hover:shadow-lg transition-shadow">
                  <TrendingUp className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">{t('students.jobMarket')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('students.jobMarketDesc')}
                  </p>
                </div>
                
                <div className="card-elevated p-6 text-left hover:shadow-lg transition-shadow">
                  <Target className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">{t('students.criteria')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('students.criteriaDesc')}
                  </p>
                </div>
                
                <div className="card-elevated p-6 text-left hover:shadow-lg transition-shadow">
                  <Award className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">{t('students.growth')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('students.growthDesc')}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Career Paths */}
        <CareerPathsSection />

        {/* Market Analysis */}
        <MarketSection />

        {/* ML Analysis */}
        <div className="bg-card">
          <AnalysisSection />
        </div>

        {/* Enhanced Professions Section */}
        <section className="py-16 bg-background">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-4xl mx-auto mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                <Briefcase className="w-5 h-5" />
                <span className="text-sm font-medium">{t('students.badge')}</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
                Профессии и карьерные траектории
              </h2>
              <p className="text-lg text-muted-foreground">
                Подробные описания основных профессий всех сфер. Выбирайте профессию из списка для детального изучения.
              </p>
            </motion.div>

            {/* Professions Display */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Professions List - Left Side */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="sticky top-24 space-y-4"
                >
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Поиск профессии..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-card"
                    />
                  </div>

                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Все профессии ({filteredProfessions.length})
                  </h3>
                  
                  <div className="space-y-2 max-h-[calc(100vh-350px)] overflow-y-auto pr-2">
                    {filteredProfessions.map((profession, index) => {
                      const IconComponent = professionIcons[profession.title] || Briefcase;
                      return (
                        <motion.button
                          key={profession.title}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.03 }}
                          onClick={() => {
                            setSelectedProfession(profession.title);
                            setActiveTab('overview');
                          }}
                          className={cn(
                            "w-full text-left p-4 rounded-xl border transition-all duration-200 hover:shadow-md group",
                            selectedProfession === profession.title
                              ? "bg-primary/5 border-primary/30 shadow-md ring-2 ring-primary/20"
                              : "bg-card border-border hover:border-primary/30 hover:shadow-sm"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                              selectedProfession === profession.title
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted group-hover:bg-primary/10 group-hover:text-primary"
                            )}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="font-semibold text-foreground text-sm truncate pr-2">
                                  {profession.title}
                                </h4>
                                {selectedProfession === profession.title && (
                                  <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                )}
                              </div>
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "text-xs font-normal mb-2",
                                  categoryColors[profession.category] || "bg-muted text-muted-foreground"
                                )}
                              >
                                {profession.category}
                              </Badge>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">{profession.salary.average.toLocaleString()} BYN</span>
                                </div>
                                <Badge 
                                  variant={profession.marketDemand === 'Очень высокий' ? 'default' : 'secondary'}
                                  className="text-xs h-5"
                                >
                                  {profession.marketDemand}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              </div>

              {/* Profession Details - Right Side */}
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {selectedProfessionData ? (
                    <motion.div
                      key={selectedProfessionData.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden"
                    >
                      {/* Header */}
                      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-6 border-b border-border">
                        <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "text-sm font-medium",
                                  categoryColors[selectedProfessionData.category] || ""
                                )}
                              >
                                {selectedProfessionData.category}
                              </Badge>
                              <Badge 
                                variant={selectedProfessionData.marketDemand === 'Очень высокий' ? 'default' : 'secondary'} 
                                className="text-sm font-medium"
                              >
                                {selectedProfessionData.marketDemand} спрос
                              </Badge>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                              {selectedProfessionData.title}
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                              {selectedProfessionData.description}
                            </p>
                          </div>
                          <div className="flex md:block gap-2">
                            <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl text-center border border-green-500/20 min-w-[140px]">
                              <Trophy className="w-5 h-5 text-green-600 mx-auto mb-1" />
                              <p className="text-2xl font-bold text-green-600">
                                {selectedProfessionData.salary.average.toLocaleString()} BYN
                              </p>
                              <p className="text-xs text-muted-foreground">средняя зарплата</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-foreground">{selectedProfessionData.salary.growth}</p>
                            <p className="text-xs text-muted-foreground">годовой рост</p>
                          </div>
                           <div className="text-center">
                             <p className="text-2xl font-bold text-foreground">
                               {selectedProfessionData.skillLevels?.hard?.length + selectedProfessionData.skillLevels?.soft?.length || 0}
                             </p>
                             <p className="text-xs text-muted-foreground">ключевых навыков</p>
                           </div>
                           <div className="text-center">
                             <p className="text-2xl font-bold text-foreground">{selectedProfessionData.location}</p>
                             <p className="text-xs text-muted-foreground">формат работы</p>
                           </div>
                        </div>
                      </div>

                      {/* Tabs */}
                      <div className="border-b border-border bg-muted/20 overflow-x-auto">
                        <div className="flex p-4 gap-2 min-w-max">
                          {TABS.map((tab) => {
                            const TabIcon = tab.icon;
                            return (
                              <Button
                                key={tab.id}
                                variant={activeTab === tab.id ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                  "gap-2 transition-all",
                                  activeTab === tab.id && "shadow-sm bg-primary text-primary-foreground"
                                )}
                              >
                                <TabIcon className="w-4 h-4" />
                                <span>{tab.label}</span>
                              </Button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Tab Content */}
                      <div className="p-6">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <div className="p-5 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl border border-border">
                                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                        <Target className="w-5 h-5 text-primary" />
                                        Карьерный путь
                                      </h4>
                                      <p className="text-sm text-muted-foreground leading-relaxed">
                                        {selectedProfessionData.careerPath}
                                      </p>
                                    </div>
                                    
                                    <div className="p-5 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-xl border border-border">
                                       <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                         <MapPin className="w-5 h-5 text-primary" />
                                         Формат работы
                                       </h4>
                                      <p className="text-sm text-muted-foreground font-medium">
                                        {selectedProfessionData.location}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-4">
                                    <div className="p-5 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-xl border border-border">
                                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5 text-primary" />
                                        Спрос на рынке
                                      </h4>
                                      <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm text-muted-foreground">Уровень спроса:</span>
                                          <Badge variant={selectedProfessionData.marketDemand === 'Очень высокий' ? 'default' : 'secondary'} className="font-medium">
                                            {selectedProfessionData.marketDemand}
                                          </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm text-muted-foreground">Актуальность:</span>
                                          <Badge variant="outline" className="text-green-600 border-green-600 font-medium">
                                            ✓ Актуально
                                          </Badge>
                                        </div>
                                        <div className="pt-2 mt-2 border-t border-border">
                                          <p className="text-xs text-muted-foreground leading-relaxed">
                                            {selectedProfessionData.relevance}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-primary" />
                                        Быстрые факты
                                      </h4>
                                      <ul className="space-y-3 text-sm">
                                        <li className="flex items-start gap-2.5">
                                          <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                                          <span>Средняя зарплата: <strong className="text-foreground">{selectedProfessionData.salary.average.toLocaleString()} BYN</strong></span>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                          <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                          <span>Годовой рост: <strong className="text-green-600">{selectedProfessionData.salary.growth}</strong></span>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                            <span>Ключевые навыки: <strong className="text-foreground">{selectedProfessionData.skillLevels?.hard?.length + selectedProfessionData.skillLevels?.soft?.length || 0}</strong> компетенций</span>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Career Tab */}
                            {activeTab === 'career' && (
                              <div className="space-y-6">
                                <div>
                                  <h4 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                    Карьерная траектория
                                  </h4>
                                  <div className="relative">
                                    {/* Timeline Line */}
                                    <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-border"></div>
                                    
                                    <div className="space-y-8">
                                      {selectedProfessionData.careerPath.split('→').map((level, index) => {
                                        const trimmedLevel = level.trim();
                                        return (
                                          <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="relative flex items-start gap-5"
                                          >
                                            {/* Timeline Dot */}
                                            <div className="flex-shrink-0 z-10">
                                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 border-4 border-background shadow-lg flex items-center justify-center text-xs font-bold text-white">
                                                {index + 1}
                                              </div>
                                            </div>
                                            <div className="flex-1 pt-1.5">
                                              <div className="flex items-center justify-between mb-1">
                                                <h5 className="font-bold text-foreground text-base">
                                                  {trimmedLevel}
                                                </h5>
                                              </div>
                                              <p className="text-sm text-muted-foreground leading-relaxed">
                                                {trimmedLevel}
                                              </p>
                                            </div>
                                          </motion.div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="p-5 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-xl border border-green-500/20">
                                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                    Перспективы роста
                                  </h4>
                                  <p className="text-muted-foreground leading-relaxed">
                                    {selectedProfessionData.prospects}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Skills Tab */}
                            {activeTab === 'skills' && (
                              <div className="space-y-8">
                                {/* Hard Skills */}
                                <div>
                                  <h4 className="font-semibold text-foreground mb-5 flex items-center gap-2">
                                    <Code className="w-5 h-5 text-primary" />
                                    Hard Skills (Технические навыки)
                                  </h4>
                                    <div className="space-y-4">
                                      {selectedProfessionData.skillLevels.hard.map((skillData, index) => (
                                        <motion.div
                                          key={index}
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: index * 0.05 }}
                                          className="space-y-2"
                                        >
                                          <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-foreground">{skillData.skill}</span>
                                            <span className="text-xs font-medium text-muted-foreground">{skillData.level}%</span>
                                          </div>
                                          <Progress value={skillData.level} className="h-2" />
                                        </motion.div>
                                      ))}
                                    </div>
                                </div>

                                {/* Soft Skills */}
                                <div>
                                  <h4 className="font-semibold text-foreground mb-5 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-purple-500" />
                                    Soft Skills (Гибкие навыки)
                                  </h4>
                                  <div className="space-y-4">
                                    {selectedProfessionData.skillLevels.soft.map((skillData, index) => (
                                      <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="space-y-2"
                                      >
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm font-medium text-foreground">{skillData.skill}</span>
                                          <span className="text-xs font-medium text-muted-foreground">{skillData.level}%</span>
                                        </div>
                                        <Progress value={skillData.level} className="h-2" />
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>
                                

                                <div className="p-5 bg-gradient-to-br from-yellow-500/5 to-amber-500/5 rounded-xl border border-yellow-500/20">
                                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-500" />
                                    Актуальность профессии
                                  </h4>
                                  <p className="text-muted-foreground leading-relaxed">
                                    {selectedProfessionData.relevance}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Education Tab */}
                            {activeTab === 'education' && (
                              <div className="space-y-6">
                                <div>
                                  <h4 className="font-semibold text-foreground mb-5 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-primary" />
                                    Где и как учиться
                                  </h4>
                                  <div className="space-y-3">
                                    {selectedProfessionData.education.map((edu, index) => (
                                      <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors"
                                      >
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                          <BookOpen className="w-5 h-5 text-primary" />
                                        </div>
                                        <p className="text-sm text-foreground pt-1 leading-relaxed">{edu}</p>
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Salary Tab */}
                            {activeTab === 'salary' && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl border-2 border-green-500/30">
                                    <div className="flex items-center gap-4 mb-5">
                                      <div className="p-4 bg-green-500/20 rounded-xl">
                                        <Trophy className="w-8 h-8 text-green-600" />
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground">Средняя зарплата</p>
                                        <p className="text-4xl font-bold text-green-600">
                                          {selectedProfessionData.salary.average.toLocaleString()} BYN
                                        </p>
                                      </div>
                                    </div>
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between text-sm p-3 bg-green-500/5 rounded-lg">
                                        <span className="text-muted-foreground">Диапазон:</span>
                                        <span className="font-semibold text-foreground">{selectedProfessionData.salary.range}</span>
                                      </div>
                                      <div className="flex items-center justify-between text-sm p-3 bg-green-500/5 rounded-lg">
                                        <span className="text-muted-foreground">Годовой рост:</span>
                                        <span className="font-semibold text-green-600">{selectedProfessionData.salary.growth}</span>
                                      </div>
                                    </div>
                                   </div>
                                 </div>
                              </div>
                            )}

                            {/* Prospects Tab */}
                            {activeTab === 'prospects' && (
                              <div className="space-y-6">
                                <div className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-xl border-2 border-primary/20">
                                  <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                    Карьерные перспективы
                                  </h4>
                                  <p className="text-muted-foreground leading-relaxed mb-4 text-base">
                                    {selectedProfessionData.prospects}
                                  </p>
                                  <div className="flex items-center gap-2 text-sm p-3 bg-card rounded-lg">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    <span className="font-medium text-foreground">Актуальность:</span>
                                    <span className="text-muted-foreground">{selectedProfessionData.relevance}</span>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="p-5 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl border border-green-500/20 text-center">
                                    <TrendingUp className="w-10 h-10 text-green-600 mx-auto mb-3" />
                                    <p className="text-3xl font-bold text-foreground mb-1">
                                      {selectedProfessionData.salary.growth}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Рост зарплат в год</p>
                                  </div>
                                  <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 text-center">
                                    <MapPin className="w-10 h-10 text-primary mx-auto mb-3" />
                                    <p className="text-3xl font-bold text-foreground mb-1">
                                      {selectedProfessionData.location.split(',').length}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Городов присутствия</p>
                                  </div>
                                  <div className="p-5 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl border border-blue-500/20 text-center">
                                    <Users className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                                    <p className="text-2xl font-bold text-foreground mb-1">
                                      Высокий
                                    </p>
                                    <p className="text-xs text-muted-foreground">Уровень конкуренции</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full min-h-[500px] text-center p-12 bg-gradient-to-br from-muted/20 to-muted/10 rounded-2xl border-2 border-dashed border-border"
                    >
                      <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                        <Briefcase className="w-12 h-12 text-primary/30" />
                      </div>
                      <h3 className="text-2xl font-semibold text-foreground mb-3">
                        Выберите профессию
                      </h3>
                      <p className="text-muted-foreground max-w-md text-lg">
                        Выберите профессию из списка слева, чтобы увидеть подробное описание, 
                        карьерный путь, навыки, зарплатные ожидания и другие важные детали.
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-6"
                        onClick={() => setSelectedProfession(ALL_PROFESSIONS[0].title)}
                      >
                        Показать пример
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-card">
          <AnalysisSection />
        </div>
      </motion.main>

      <FooterSection onNavigate={() => {}} />
    </div>
  );
};

export default Students;