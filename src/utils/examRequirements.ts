import * as XLSX from 'xlsx';

export interface FacultyExamRequirement {
  university: string;
  faculty: string;
  specialty: string;
  code: string;
  firstExam: string;
  secondExam: string;
  thirdExam: string;
}

const FALLBACK_REQUIREMENTS: FacultyExamRequirement[] = [
  { university: 'БГУ', faculty: 'Факультет информационных технологий', specialty: 'Информатика и технологии программирования', code: '1-40 02 01', firstExam: 'математика', secondExam: 'физика', thirdExam: 'русский' },
  { university: 'БГУ', faculty: 'ФПМИ', specialty: 'Прикладная математика', code: '1-31 03 03', firstExam: 'математика', secondExam: 'физика', thirdExam: 'русский' },
  { university: 'БГУ', faculty: 'Механико-математический', specialty: 'Математика', code: '1-31 03 01', firstExam: 'математика', secondExam: 'физика', thirdExam: 'русский' },
  { university: 'БГУ', faculty: 'Физический', specialty: 'Физика', code: '1-31 04 01', firstExam: 'физика', secondExam: 'математика', thirdExam: 'русский' },
  { university: 'БГУ', faculty: 'Химический', specialty: 'Химия', code: '1-31 05 01', firstExam: 'химия', secondExam: 'биология', thirdExam: 'русский' },
  { university: 'БГУ', faculty: 'Биологический', specialty: 'Биология', code: '1-31 01 01', firstExam: 'биология', secondExam: 'химия', thirdExam: 'русский' },
  { university: 'БГУ', faculty: 'Географический', specialty: 'География', code: '1-31 02 01', firstExam: 'география', secondExam: 'история', thirdExam: 'русский' },
  { university: 'БГУ', faculty: 'Юридический', specialty: 'Правоведение', code: '1-24 01 01', firstExam: 'история', secondExam: 'обществоведение', thirdExam: 'русский' },
  { university: 'БГУ', faculty: 'Экономический', specialty: 'Экономика', code: '1-25 01 01', firstExam: 'математика', secondExam: 'обществоведение', thirdExam: 'русский' },
  { university: 'БГУ', faculty: 'Филологический', specialty: 'Русская филология', code: '1-21 05 01', firstExam: 'русский', secondExam: 'история', thirdExam: 'белорусский' },
  { university: 'БГУ', faculty: 'Журналистики', specialty: 'Журналистика', code: '1-23 01 05', firstExam: 'русский', secondExam: 'история', thirdExam: 'обществоведение' },
  { university: 'БГУ', faculty: 'Психологии', specialty: 'Психология', code: '1-23 01 06', firstExam: 'биология', secondExam: 'обществоведение', thirdExam: 'русский' },
  { university: 'БГУИР', faculty: 'Факультет компьютерных технологий', specialty: 'Информатика и технологии программирования', code: '1-40 02 01', firstExam: 'математика', secondExam: 'физика', thirdExam: 'русский' },
  { university: 'БГУИР', faculty: 'Факультет радиотехники', specialty: 'Радиотехника', code: '1-39 02 01', firstExam: 'физика', secondExam: 'математика', thirdExam: 'русский' },
  { university: 'БГУИР', faculty: 'Факультет информационной безопасности', specialty: 'Информационная безопасность', code: '1-98 01 01', firstExam: 'математика', secondExam: 'физика', thirdExam: 'русский' },
  { university: 'БНТУ', faculty: 'Машиностроительный', specialty: 'Машиностроение', code: '1-36 01 01', firstExam: 'математика', secondExam: 'физика', thirdExam: 'русский' },
  { university: 'БНТУ', faculty: 'Энергетический', specialty: 'Энергетика', code: '1-43 01 01', firstExam: 'математика', secondExam: 'физика', thirdExam: 'русский' },
  { university: 'БГМУ', faculty: 'Лечебный', specialty: 'Лечебное дело', code: '1-79 01 01', firstExam: 'биология', secondExam: 'химия', thirdExam: 'русский' },
  { university: 'БГМУ', faculty: 'Стоматологический', specialty: 'Стоматология', code: '1-79 01 03', firstExam: 'биология', secondExam: 'химия', thirdExam: 'русский' },
  { university: 'БГПУ', faculty: 'Педагогический', specialty: 'Дошкольное образование', code: '1-01 01 01', firstExam: 'биология', secondExam: 'русский', thirdExam: 'белорусский' },
];

export async function loadExamRequirements(): Promise<FacultyExamRequirement[]> {
  try {
    const response = await fetch('/subjects.xlsx');
    if (!response.ok) {
      console.warn('Using fallback requirements - file not found');
      return FALLBACK_REQUIREMENTS;
    }
    
    const buffer = await response.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(firstSheet);
    
    if (!data || data.length === 0) {
      console.warn('Excel is empty, using fallback requirements');
      return FALLBACK_REQUIREMENTS;
    }
    
    const requirements: FacultyExamRequirement[] = (data as Record<string, unknown>[]).map((row) => {
      const getVal = (candidates: string[]) => {
        for (const c of candidates) {
          if (row[c] !== undefined) return String(row[c]).trim();
        }
        return '';
      };
      
      return {
        university: 'БГУ',
        faculty: getVal(['__EMPTY', 'Факультет', 'факультет']),
        specialty: getVal(['__EMPTY', 'Факультет', 'факультет']),
        code: '',
        firstExam: normalizeExamName(getVal(['предме', 'предмет', 'предмет_1', '1', '1 предмет', 'Предмет 1', 'Экзамен 1'])),
        secondExam: normalizeExamName(getVal(['предмет', 'предме', 'предмет_2', '2', '2 предмета', 'Предмет 2', 'Экзамен 2'])),
        thirdExam: normalizeExamName(getVal(['предмет_1', 'предмет_2', 'предмет_3', '3', '3 предмета', 'Предмет 3', 'Экзамен 3'])),
      };
    }).filter(r => r.faculty && (r.firstExam || r.secondExam));
    
    if (requirements.length === 0) {
      return FALLBACK_REQUIREMENTS;
    }
    
    return [...requirements, ...FALLBACK_REQUIREMENTS];
  } catch (err) {
    console.error('ERROR loading requirements:', err);
    return FALLBACK_REQUIREMENTS;
  }
}

function normalizeExamName(name: string): string {
  if (!name) return '';
  
  const lower = name.toLowerCase().trim();
  
  const map: Record<string, string> = {
    'матем': 'математика',
    'мат': 'математика',
    'математика': 'математика',
    'физика': 'физика',
    'физ': 'физика',
    'химия': 'химия',
    'биология': 'биология',
    'билогия': 'биология',
    'био': 'биология',
    'география': 'география',
    'гео': 'география',
    'англ': 'английский',
    'английский': 'английский',
    'ин язык': 'английский',
    'иностранный': 'английский',
    'немецкий': 'немецкий',
    'французский': 'французский',
    'история беларуси': 'история',
    'история': 'история',
    'всемирная история': 'история',
    'обществоведение': 'обществоведение',
    'общество': 'обществоведение',
    'русский': 'русский',
    'белорусский': 'белорусский',
    'рус': 'русский',
    'бел': 'белорусский',
    'рус/бел': 'русский',
    'на выбор': '',
    'творчество': '',
    'экзамен "творчество"': '',
  };
  
  return map[lower] || lower;
}

export function getExamIdFromName(examName: string): string {
  const map: Record<string, string> = {
    'русский': 'russian',
    'белорусский': 'belarusian',
    'математика': 'math',
    'физика': 'physics',
    'химия': 'chemistry',
    'биология': 'biology',
    'география': 'geography',
    'история': 'world_history',
    'история беларуси': 'world_history',
    'обществоведение': 'social_science',
    'английский': 'english',
    'немецкий': 'german',
    'французский': 'french',
    'испанский': 'spanish',
    'китайский': 'chinese',
  };
  return map[examName.toLowerCase().trim()] || examName.toLowerCase().trim();
}
