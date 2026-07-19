// ⚠️ Числовые значения обнулены — заменить на реальные данные из БД
// Средние проходные баллы для университетов Беларуси (2025 год)
// Данные с https://kudapostupat.by/zavedeniya/vuz

export const UNIVERSITY_AVERAGE_MARKS: Record<string, number> = {
  'БГУ': 349,
  'БГУИР': 342,
  'БНТУ': 284,
  'БГЭУ': 340,
  'БГМУ': 364,
  'БГПУ': 290,
  'ГрГУ': 278,
  'ВГУ': 267,
  'ГГТУ': 272,
  'ПГУ': 245,
  'БГУИЯ': 358,
  'Академия управления': 361,
  'Академия МВД': 261,
  'БрГУ': 287,
  'БГАА': 332,
  'БГУКИ': 309,
  'БГУФК': 301,
  'БГТУ': 280,
  'БГУТ': 265,
  'БТЭУ': 275,
  'БрГТУ': 255,
  'ВГМУ': 340,
  'ВГТУ': 260,
  'ГГУ': 268,
  'ГГМУ': 330,
  'ГрГМУ': 345,
  'МГУ': 258,
  'МГПУ': 248,
  'ПолесскийГУ': 242,
  'ПолоцкийГУ': 250,
  'БГАИ': 290,
  'БГАМ': 315,
  'БГСХА': 270,
  'БГАС': 280,
  'БГАВМ': 295,
  'БГАУ': 268,
  'МИУ': 255,
  'БРУ': 260,
  'Академия связи': 320,
  'ВА': 340,
  'УГЗ': 310,
  'ИПС': 330,
  'МИ МВД': 275,
  'УНАНБ': 285,
  'МГЭИ': 275,
  'ИСЗ': 260,
  'МИУП': 250,
  'КБП': 245,
  'ГрКБП': 240,
  'СЭК': 235,
  'Филиал РГСУ': 250,
  'МГАК': 240,
  'БГУПиХТ': 275,
  'БГУАТ': 260,
  'МИНК': 255,
  'БГУП': 265,
};

// Интерфейс для университета
export interface University {
  id: string;
  short_name: string;
  full_name: string;
  city: string;
  website?: string;
  average_mark: number;
}

// Полный список из 53 университетов Беларуси
export const ALL_UNIVERSITIES: University[] = [
  // Минск - основные университеты
  { id: 'bsu', short_name: 'БГУ', full_name: 'Белорусский государственный университет', city: 'Минск', website: 'https://www.bsu.by', average_mark: 0 },
  { id: 'bsuir', short_name: 'БГУИР', full_name: 'Белорусский государственный университет информатики и радиоэлектроники', city: 'Минск', website: 'https://www.bsuir.by', average_mark: 0 },
  { id: 'bntu', short_name: 'БНТУ', full_name: 'Белорусский национальный технический университет', city: 'Минск', website: 'https://www.bntu.by', average_mark: 0 },
  { id: 'bsmu', short_name: 'БГМУ', full_name: 'Белорусский государственный медицинский университет', city: 'Минск', website: 'https://www.bsmu.by', average_mark: 0 },
  { id: 'bseu', short_name: 'БГЭУ', full_name: 'Белорусский государственный экономический университет', city: 'Минск', website: 'https://www.bseu.by', average_mark: 0 },
  { id: 'bspu', short_name: 'БГПУ', full_name: 'Белорусский государственный педагогический университет им. М. Танка', city: 'Минск', website: 'https://www.bspu.by', average_mark: 0 },
  { id: 'bsuia', short_name: 'БГУИЯ', full_name: 'Белорусский государственный университет иностранных языков', city: 'Минск', website: 'https://www.bguil.by', average_mark: 0 },
  { id: 'bsuki', short_name: 'БГУКИ', full_name: 'Белорусский государственный университет культуры и искусств', city: 'Минск', website: 'https://www.bsuki.by', average_mark: 0 },
  { id: 'bsufk', short_name: 'БГУФК', full_name: 'Белорусский государственный университет физической культуры', city: 'Минск', website: 'https://www.bsufk.by', average_mark: 0 },
  { id: 'bstu', short_name: 'БГТУ', full_name: 'Белорусский государственный технологический университет', city: 'Минск', website: 'https://www.bstu.by', average_mark: 0 },
  { id: 'bsaa', short_name: 'БГАА', full_name: 'Белорусская государственная академия авиации', city: 'Минск', website: 'https://www.bsaa.by', average_mark: 0 },
  { id: 'academy_management', short_name: 'Академия управления', full_name: 'Академия управления при Президенте Республики Беларусь', city: 'Минск', website: 'https://www.adm.by', average_mark: 0 },
  { id: 'academy_mvd', short_name: 'Академия МВД', full_name: 'Академия Министерства внутренних дел Республики Беларусь', city: 'Минск', website: 'https://www.academy.mvd.gov.by', average_mark: 0 },
  { id: 'bga', short_name: 'БГАИ', full_name: 'Белорусская государственная академия искусств', city: 'Минск', website: 'https://www.bga.by', average_mark: 0 },
  { id: 'bgam', short_name: 'БГАМ', full_name: 'Белорусская государственная академия музыки', city: 'Минск', website: 'https://www.bgam.by', average_mark: 0 },
  { id: 'bgsa', short_name: 'БГАС', full_name: 'Белорусская государственная академия связи', city: 'Минск', website: 'https://www.bgsa.by', average_mark: 0 },
  { id: 'va', short_name: 'ВА', full_name: 'Военная академия Республики Беларусь', city: 'Минск', website: 'https://www.va.by', average_mark: 0 },
  { id: 'ugz', short_name: 'УГЗ', full_name: 'Университет гражданской защиты МЧС', city: 'Минск', website: 'https://www.ugz.by', average_mark: 0 },
  { id: 'ips', short_name: 'ИПС', full_name: 'Институт пограничной службы Республики Беларусь', city: 'Минск', website: 'https://www.ips.by', average_mark: 0 },
  { id: 'unb', short_name: 'УНАНБ', full_name: 'Университет Национальной академии наук Беларуси', city: 'Минск', website: 'https://www.unb.by', average_mark: 0 },
  { id: 'meii', short_name: 'МГЭИ', full_name: 'Международный государственный экологический институт им. А.Д. Сахарова', city: 'Минск', website: 'https://www.meii.bsu.by', average_mark: 0 },
  { id: 'isk', short_name: 'ИСЗ', full_name: 'Институт современных знаний им. Широкова', city: 'Минск', website: 'https://www.isk.by', average_mark: 0 },
  { id: 'imi', short_name: 'МИУП', full_name: 'Международный институт управления и предпринимательства', city: 'Минск', website: 'https://www.imi.by', average_mark: 0 },
  { id: 'cbpl', short_name: 'КБП', full_name: 'Колледж бизнеса и права', city: 'Минск', website: 'https://www.cbpl.by', average_mark: 0 },
  { id: 'miu', short_name: 'МИУ', full_name: 'Минский инновационный университет', city: 'Минск', website: 'https://www.miu.by', average_mark: 0 },
  { id: 'bru', short_name: 'БРУ', full_name: 'Белорусско-Российский университет', city: 'Минск', website: 'https://www.bru.by', average_mark: 0 },
  { id: 'frgsu', short_name: 'Филиал РГСУ', full_name: 'Филиал Российского государственного социального университета', city: 'Минск', website: 'https://www.frgsu.by', average_mark: 0 },
  { id: 'fmga', short_name: 'МГАК', full_name: 'Минский государственный автомеханический колледж', city: 'Минск', website: 'https://www.fmga.by', average_mark: 0 },

  // Брест
  { id: 'brsu', short_name: 'БрГУ', full_name: 'Брестский государственный университет имени А.С. Пушкина', city: 'Брест', website: 'https://www.brsu.by', average_mark: 0 },
  { id: 'brstu', short_name: 'БрГТУ', full_name: 'Брестский государственный технический университет', city: 'Брест', website: 'https://www.brstu.by', average_mark: 0 },
  { id: 'psu', short_name: 'ПолесскийГУ', full_name: 'Полесский государственный университет', city: 'Пинск', website: 'https://www.psu.by', average_mark: 0 },

  // Витебск
  { id: 'vsu', short_name: 'ВГУ', full_name: 'Витебский государственный университет имени П.М. Машерова', city: 'Витебск', website: 'https://www.vsu.by', average_mark: 0 },
  { id: 'vgmu', short_name: 'ВГМУ', full_name: 'Витебский государственный ордена Дружбы Народов медицинский университет', city: 'Витебск', website: 'https://www.vgmu.by', average_mark: 0 },
  { id: 'vgtu', short_name: 'ВГТУ', full_name: 'Витебский государственный технологический университет', city: 'Витебск', website: 'https://www.vgtu.by', average_mark: 0 },
  { id: 'bgavm', short_name: 'БГАВМ', full_name: 'Белорусская государственная академия ветеринарной медицины', city: 'Витебск', website: 'https://www.bgavm.by', average_mark: 0 },
  { id: 'pgu', short_name: 'ПолоцкийГУ', full_name: 'Полоцкий государственный университет имени Евфросинии Полоцкой', city: 'Полоцк', website: 'https://www.pgu.by', average_mark: 0 },

  // Гомель
  { id: 'ggu', short_name: 'ГГУ', full_name: 'Гомельский государственный университет имени Франциска Скорины', city: 'Гомель', website: 'https://www.ggu.gomel.by', average_mark: 0 },
  { id: 'gstu', short_name: 'ГГТУ', full_name: 'Гомельский государственный технический университет им. П.О. Сухого', city: 'Гомель', website: 'https://www.ggtu.gomel.by', average_mark: 0 },
  { id: 'ggmu', short_name: 'ГГМУ', full_name: 'Гомельский государственный медицинский университет', city: 'Гомель', website: 'https://www.ggmu.gomel.by', average_mark: 0 },
  { id: 'bgtu', short_name: 'БГУТ', full_name: 'Белорусский государственный университет транспорта', city: 'Гомель', website: 'https://www.bsut.by', average_mark: 0 },
  { id: 'btec', short_name: 'БТЭУ', full_name: 'Белорусский торгово-экономический университет потребительской кооперации', city: 'Гомель', website: 'https://www.btec.by', average_mark: 0 },
  { id: 'mgpu', short_name: 'МГПУ', full_name: 'Мозырский государственный педагогический университет им. И.П. Шамякина', city: 'Мозырь', website: 'https://www.mgpu.by', average_mark: 0 },

  // Гродно
  { id: 'grsu', short_name: 'ГрГУ', full_name: 'Гродненский государственный университет имени Янки Купалы', city: 'Гродно', website: 'https://www.grsu.by', average_mark: 0 },
  { id: 'grsmu', short_name: 'ГрГМУ', full_name: 'Гродненский государственный медицинский университет', city: 'Гродно', website: 'https://www.grsmu.by', average_mark: 0 },
  { id: 'gcbpl', short_name: 'ГрКБП', full_name: 'Гродненский колледж бизнеса и права', city: 'Гродно', website: 'https://www.gcbpl.by', average_mark: 0 },

  // Могилев
  { id: 'mgu', short_name: 'МГУ', full_name: 'Могилевский государственный университет им. А. А. Кулешова', city: 'Могилев', website: 'https://www.mogilev.by', average_mark: 0 },
  { id: 'mvd_inst', short_name: 'МИ МВД', full_name: 'Могилевский институт Министерства внутренних дел', city: 'Могилев', website: 'https://www.mvd.by', average_mark: 0 },

  // Горки
  { id: 'bgsaa', short_name: 'БГСХА', full_name: 'Белорусская государственная сельскохозяйственная академия', city: 'Горки', website: 'https://www.bgsaa.by', average_mark: 0 },
  { id: 'bgau', short_name: 'БГАУ', full_name: 'Белорусский государственный аграрный университет', city: 'Горки', website: 'https://www.bga.by', average_mark: 0 },

  // Солигорск
  { id: 'sec', short_name: 'СЭК', full_name: 'Солигорский экономический колледж', city: 'Солигорск', website: 'https://www.sec.by', average_mark: 0 },

  // Академия связи (Минск)
  { id: 'as', short_name: 'Академия связи', full_name: 'Академия связи Республики Беларусь', city: 'Минск', website: 'https://www.as.by', average_mark: 0 },
  { id: 'mink', short_name: 'МИНК', full_name: 'Минский институт управления', city: 'Минск', website: 'https://www.mink.by', average_mark: 0 },
  { id: 'bgup', short_name: 'БГУП', full_name: 'Белорусский государственный университет промышленных технологий', city: 'Минск', website: 'https://www.bsu.by', average_mark: 0 },
];

// Получить средний балл по названию университета
export function getAverageMark(universityShortName: string): number {
  return UNIVERSITY_AVERAGE_MARKS[universityShortName] ||0;
}

// Получить университет по сокращенному названию
export function getUniversityByShortName(shortName: string): University | undefined {
  return ALL_UNIVERSITIES.find(u => u.short_name === shortName);
}