// ⚠️ Числовые значения обнулены — заменить на реальные данные из БД
export interface CTSubject {
  id: string;
  name: string;
  shortName: string;
}

export const CT_SUBJECTS: CTSubject[] = [
  { id: 'russian', name: 'Русский язык', shortName: 'Рус.яз.' },
  { id: 'belarusian', name: 'Белорусский язык', shortName: 'Бел.яз.' },
  { id: 'math', name: 'Математика', shortName: 'Матем.' },
  { id: 'physics', name: 'Физика', shortName: 'Физика' },
  { id: 'chemistry', name: 'Химия', shortName: 'Химия' },
  { id: 'biology', name: 'Биология', shortName: 'Биология' },
  { id: 'geography', name: 'География', shortName: 'География' },
  { id: 'world_history', name: 'История Беларуси в контексте всемирной истории', shortName: 'Ист. Б+МИР' },
  { id: 'social_science', name: 'Обществоведение', shortName: 'Обществ.' },
  { id: 'english', name: 'Английский язык', shortName: 'Иностр.' },
  { id: 'german', name: 'Немецкий язык', shortName: 'Иностр.' },
  { id: 'french', name: 'Французский язык', shortName: 'Иностр.' },
  { id: 'spanish', name: 'Испанский язык', shortName: 'Иностр.' },
  { id: 'chinese', name: 'Китайский язык', shortName: 'Иностр.' },
];

export interface SpecialtyRequirement {
  specialtyId: string;
  universityShortName: string;
  facultyName: string;
  specialtyName: string;
  specialtyCode: string;
  firstSubject: string;
  secondSubject: string;
  thirdSubject: string;
  minTotalScore: number;
}

export const CT_REQUIREMENTS: SpecialtyRequirement[] = [
  {
    specialtyId: 'bsu-fit',
    universityShortName: 'БГУ',
    facultyName: 'Факультет информационных технологий',
    specialtyName: 'Информатика и технологии программирования',
    specialtyCode: '1-40 02 01',
    firstSubject: 'math',
    secondSubject: 'physics',
    thirdSubject: 'russian',
    minTotalScore: 0,
  },
  {
    specialtyId: 'bsu-mm',
    universityShortName: 'БГУ',
    facultyName: 'Механико-математический факультет',
    specialtyName: 'Математика и информационные технологии',
    specialtyCode: '1-31 03 01-01',
    firstSubject: 'math',
    secondSubject: 'physics',
    thirdSubject: 'russian',
    minTotalScore: 0,
  },
  {
    specialtyId: 'bsu-phys',
    universityShortName: 'БГУ',
    facultyName: 'Факультет радиофизики и компьютерных технологий',
    specialtyName: 'Физика и информационные технологии',
    specialtyCode: '1-31 03 01-03',
    firstSubject: 'physics',
    secondSubject: 'math',
    thirdSubject: 'russian',
    minTotalScore: 0,
  },
  {
    specialtyId: 'bsu-bio',
    universityShortName: 'БГУ',
    facultyName: 'Биологический факультет',
    specialtyName: 'Биология и химия',
    specialtyCode: '1-31 01 01-02',
    firstSubject: 'biology',
    secondSubject: 'chemistry',
    thirdSubject: 'russian',
    minTotalScore: 0,
  },
  {
    specialtyId: 'bsu-geo',
    universityShortName: 'БГУ',
    facultyName: 'Географический факультет',
    specialtyName: 'География',
    specialtyCode: '1-31 02 01',
    firstSubject: 'geography',
    secondSubject: 'world_history',
    thirdSubject: 'russian',
    minTotalScore: 0,
  },
  {
    specialtyId: 'bsu-law',
    universityShortName: 'БГУ',
    facultyName: 'Юридический факультет',
    specialtyName: 'Правоведение',
    specialtyCode: '1-24 01 01',
    firstSubject: 'world_history',
    secondSubject: 'social_science',
    thirdSubject: 'russian',
    minTotalScore: 0,
  },
  {
    specialtyId: 'bsu-econ',
    universityShortName: 'БГУ',
    facultyName: 'Экономический факультет',
    specialtyName: 'Экономика',
    specialtyCode: '1-25 01 01',
    firstSubject: 'math',
    secondSubject: 'social_science',
    thirdSubject: 'russian',
    minTotalScore: 0,
  },
  {
    specialtyId: 'bsu-journ',
    universityShortName: 'БГУ',
    facultyName: 'Факультет журналистики',
    specialtyName: 'Журналистика',
    specialtyCode: '1-23 01 05',
    firstSubject: 'russian',
    secondSubject: 'world_history',
    thirdSubject: 'social_science',
    minTotalScore: 0,
  },
  {
    specialtyId: 'bsu-phil',
    universityShortName: 'БГУ',
    facultyName: 'Филологический факультет',
    specialtyName: 'Русская филология',
    specialtyCode: '1-21 05 01-01',
    firstSubject: 'russian',
    secondSubject: 'world_history',
    thirdSubject: 'social_science',
    minTotalScore: 0,
  },
  {
    specialtyId: 'bsu-psih',
    universityShortName: 'БГУ',
    facultyName: 'Факультет психологии',
    specialtyName: 'Психология',
    specialtyCode: '1-23 01 06',
    firstSubject: 'biology',
    secondSubject: 'social_science',
    thirdSubject: 'russian',
    minTotalScore: 0,
  },
];

export function getSubjectNameById(id: string): string {
  const subject = CT_SUBJECTS.find(s => s.id === id);
  return subject?.name || id;
}

export function getSubjectShortNameById(id: string): string {
  const subject = CT_SUBJECTS.find(s => s.id === id);
  return subject?.shortName || id;
}
