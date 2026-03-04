export interface ExamRequirement {
  facultyNames: string[];
  firstExam: string;
  secondExam: string;
  thirdExam: string;
}

export const EXAM_REQUIREMENTS: ExamRequirement[] = [
  // ========== БГУ ==========
  
  // ФПМИ - Математика + Физика + Русский
  { facultyNames: ['Факультет прикладной математики и информатики', 'ФПМИ'], firstExam: 'math', secondExam: 'physics', thirdExam: 'russian' },
  
  // ФРКТ - Математика + Физика + Русский  
  { facultyNames: ['Факультет радиофизики и компьютерных технологий', 'ФРКТ'], firstExam: 'math', secondExam: 'physics', thirdExam: 'russian' },
  
  // ММФ - Математика + Физика + Русский
  { facultyNames: ['Механико-математический факультет', 'ММФ'], firstExam: 'math', secondExam: 'physics', thirdExam: 'russian' },
  
  // ФизФ - Физика + Математика + Русский
  { facultyNames: ['Физический факультет', 'ФизФ'], firstExam: 'physics', secondExam: 'math', thirdExam: 'russian' },
  
  // ХимФ - Химия + Биология + Русский
  { facultyNames: ['Химический факультет', 'ХимФ'], firstExam: 'chemistry', secondExam: 'biology', thirdExam: 'russian' },
  
  // БиоФ - Биология + Химия + Русский
  { facultyNames: ['Биологический факультет', 'БиоФ'], firstExam: 'biology', secondExam: 'chemistry', thirdExam: 'russian' },
  
  // ЭФ - Математика + Иностранный + Русский
  { facultyNames: ['Экономический факультет', 'ЭФ'], firstExam: 'math', secondExam: 'english', thirdExam: 'russian' },
  
  // ЮФ - История + Обществоведение + Русский
  { facultyNames: ['Юридический факультет', 'ЮФ'], firstExam: 'world_history', secondExam: 'social_science', thirdExam: 'russian' },
  
  // ФилФ - Иностранный + История + Русский
  { facultyNames: ['Филологический факультет', 'ФилФ'], firstExam: 'english', secondExam: 'world_history', thirdExam: 'russian' },
  
  // ИстФ - История + Всемирная история + Русский
  { facultyNames: ['Исторический факультет', 'ИстФ'], firstExam: 'world_history', secondExam: 'world_history', thirdExam: 'russian' },
  
  // ФМО - Иностранный + Обществоведение + Русский
  { facultyNames: ['Факультет международных отношений', 'ФМО'], firstExam: 'english', secondExam: 'social_science', thirdExam: 'russian' },
  
  // ФСК - История + Обществоведение + Русский
  { facultyNames: ['Факультет социокультурных коммуникаций', 'ФСК'], firstExam: 'world_history', secondExam: 'social_science', thirdExam: 'russian' },
  
  // ФЖ - История + Обществоведение + Русский
  { facultyNames: ['Факультет журналистики', 'ФЖ'], firstExam: 'world_history', secondExam: 'social_science', thirdExam: 'russian' },
  
  // ФГиГ - География + Математика + Русский
  { facultyNames: ['Факультет географии и геоинформатики', 'ФГиГ'], firstExam: 'geography', secondExam: 'math', thirdExam: 'russian' },
  
  // ФФиСН - История + Обществоведение + Русский
  { facultyNames: ['Факультет философии и социальных наук', 'ФФиСН'], firstExam: 'world_history', secondExam: 'social_science', thirdExam: 'russian' },
  
  // ВФ - Математика + Физика + Русский
  { facultyNames: ['Военный факультет', 'ВФ'], firstExam: 'math', secondExam: 'physics', thirdExam: 'russian' },
  
  // ИБ - Математика + Иностранный + Русский
  { facultyNames: ['Институт бизнеса БГУ', 'ИБ'], firstExam: 'math', secondExam: 'english', thirdExam: 'russian' },
  
  // ИТ - История + Обществоведение + Русский
  { facultyNames: ['Институт теологии имени святых Мефодия и Кирилла', 'ИТ'], firstExam: 'world_history', secondExam: 'social_science', thirdExam: 'russian' },
  
  // МГЭИ - Биология + Химия + Русский
  { facultyNames: ['Международный государственный экологический институт им. А.Д.Сахарова', 'МГЭИ'], firstExam: 'biology', secondExam: 'chemistry', thirdExam: 'russian' },
  
  // СИБД - Математика + Иностранный + Русский
  { facultyNames: ['Совместный институт БГУ и Даляньского политехнического университета', 'СИБД'], firstExam: 'math', secondExam: 'english', thirdExam: 'russian' },

  // ========== БГУИР ==========
  
  // Факультет компьютерного проектирования - Математика + Физика + Русский
  { facultyNames: ['Факультет компьютерного проектирования'], firstExam: 'math', secondExam: 'physics', thirdExam: 'russian' },
  
  // Факультет информационных технологий и управления - Математика + Физика + Русский
  { facultyNames: ['Факультет информационных технологий и управления'], firstExam: 'math', secondExam: 'physics', thirdExam: 'russian' },
  
  // Факультет радиотехники и электроники - Физика + Математика + Русский
  { facultyNames: ['Факультет радиотехники и электроники'], firstExam: 'physics', secondExam: 'math', thirdExam: 'russian' },
  
  // Факультет компьютерных систем и сетей - Математика + Физика + Русский
  { facultyNames: ['Факультет компьютерных систем и сетей'], firstExam: 'math', secondExam: 'physics', thirdExam: 'russian' },
  
  // Факультет информационной безопасности - Математика + Физика + Русский
  { facultyNames: ['Факультет информационной безопасности'], firstExam: 'math', secondExam: 'physics', thirdExam: 'russian' },
  
  // Инженерно-экономический факультет - Математика + Иностранный + Русский
  { facultyNames: ['Инженерно-экономический факультет'], firstExam: 'math', secondExam: 'english', thirdExam: 'russian' },
  
  // Военный факультет (БГУИР) - Математика + Физика + Русский
  { facultyNames: ['Военный факультет'], firstExam: 'math', secondExam: 'physics', thirdExam: 'russian' },
];

export function getExamRequirementsByFaculty(facultyName: string): { firstExam: string; secondExam: string; thirdExam: string } | null {
  for (const req of EXAM_REQUIREMENTS) {
    if (req.facultyNames.includes(facultyName)) {
      return {
        firstExam: req.firstExam,
        secondExam: req.secondExam,
        thirdExam: req.thirdExam
      };
    }
  }
  return null;
}
