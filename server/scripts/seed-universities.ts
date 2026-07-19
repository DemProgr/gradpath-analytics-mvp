import 'dotenv/config';
import { db } from '../src/db';
import { universities } from '../src/db/schema/universities';

const universityData = [
  { id: 'bsu', shortName: 'БГУ', fullName: 'Белорусский государственный университет', city: 'Минск', website: 'https://www.bsu.by' },
  { id: 'bsuir', shortName: 'БГУИР', fullName: 'Белорусский государственный университет информатики и радиоэлектроники', city: 'Минск', website: 'https://www.bsuir.by' },
  { id: 'bntu', shortName: 'БНТУ', fullName: 'Белорусский национальный технический университет', city: 'Минск', website: 'https://www.bntu.by' },
  { id: 'bsmu', shortName: 'БГМУ', fullName: 'Белорусский государственный медицинский университет', city: 'Минск', website: 'https://www.bsmu.by' },
  { id: 'bseu', shortName: 'БГЭУ', fullName: 'Белорусский государственный экономический университет', city: 'Минск', website: 'https://www.bseu.by' },
  { id: 'bspu', shortName: 'БГПУ', fullName: 'Белорусский государственный педагогический университет им. М. Танка', city: 'Минск', website: 'https://www.bspu.by' },
  { id: 'bsuia', shortName: 'БГУИЯ', fullName: 'Белорусский государственный университет иностранных языков', city: 'Минск', website: 'https://www.bguil.by' },
  { id: 'bsuki', shortName: 'БГУКИ', fullName: 'Белорусский государственный университет культуры и искусств', city: 'Минск', website: 'https://www.bsuki.by' },
  { id: 'bsufk', shortName: 'БГУФК', fullName: 'Белорусский государственный университет физической культуры', city: 'Минск', website: 'https://www.bsufk.by' },
  { id: 'bstu', shortName: 'БГТУ', fullName: 'Белорусский государственный технологический университет', city: 'Минск', website: 'https://www.bstu.by' },
  { id: 'bsaa', shortName: 'БГАА', fullName: 'Белорусская государственная академия авиации', city: 'Минск', website: 'https://www.bsaa.by' },
  { id: 'academy_management', shortName: 'Академия управления', fullName: 'Академия управления при Президенте Республики Беларусь', city: 'Минск', website: 'https://www.adm.by' },
  { id: 'academy_mvd', shortName: 'Академия МВД', fullName: 'Академия Министерства внутренних дел Республики Беларусь', city: 'Минск', website: 'https://www.academy.mvd.gov.by' },
  { id: 'bga', shortName: 'БГАИ', fullName: 'Белорусская государственная академия искусств', city: 'Минск', website: 'https://www.bga.by' },
  { id: 'bgam', shortName: 'БГАМ', fullName: 'Белорусская государственная академия музыки', city: 'Минск', website: 'https://www.bgam.by' },
  { id: 'bgsa', shortName: 'БГАС', fullName: 'Белорусская государственная академия связи', city: 'Минск', website: 'https://www.bgsa.by' },
  { id: 'va', shortName: 'ВА', fullName: 'Военная академия Республики Беларусь', city: 'Минск', website: 'https://www.va.by' },
  { id: 'ugz', shortName: 'УГЗ', fullName: 'Университет гражданской защиты МЧС', city: 'Минск', website: 'https://www.ugz.by' },
  { id: 'ips', shortName: 'ИПС', fullName: 'Институт пограничной службы Республики Беларусь', city: 'Минск', website: 'https://www.ips.by' },
  { id: 'unb', shortName: 'УНАНБ', fullName: 'Университет Национальной академии наук Беларуси', city: 'Минск', website: 'https://www.unb.by' },
  { id: 'meii', shortName: 'МГЭИ', fullName: 'Международный государственный экологический институт им. А.Д. Сахарова', city: 'Минск', website: 'https://www.meii.bsu.by' },
  { id: 'isk', shortName: 'ИСЗ', fullName: 'Институт современных знаний им. Широкова', city: 'Минск', website: 'https://www.isk.by' },
  { id: 'imi', shortName: 'МИУП', fullName: 'Международный институт управления и предпринимательства', city: 'Минск', website: 'https://www.imi.by' },
  { id: 'cbpl', shortName: 'КБП', fullName: 'Колледж бизнеса и права', city: 'Минск', website: 'https://www.cbpl.by' },
  { id: 'miu', shortName: 'МИУ', fullName: 'Минский инновационный университет', city: 'Минск', website: 'https://www.miu.by' },
  { id: 'bru', shortName: 'БРУ', fullName: 'Белорусско-Российский университет', city: 'Минск', website: 'https://www.bru.by' },
  { id: 'frgsu', shortName: 'Филиал РГСУ', fullName: 'Филиал Российского государственного социального университета', city: 'Минск', website: 'https://www.frgsu.by' },
  { id: 'fmga', shortName: 'МГАК', fullName: 'Минский государственный автомеханический колледж', city: 'Минск', website: 'https://www.fmga.by' },
  { id: 'brsu', shortName: 'БрГУ', fullName: 'Брестский государственный университет имени А.С. Пушкина', city: 'Брест', website: 'https://www.brsu.by' },
  { id: 'brstu', shortName: 'БрГТУ', fullName: 'Брестский государственный технический университет', city: 'Брест', website: 'https://www.brstu.by' },
  { id: 'psu', shortName: 'ПолесскийГУ', fullName: 'Полесский государственный университет', city: 'Пинск', website: 'https://www.psu.by' },
  { id: 'vsu', shortName: 'ВГУ', fullName: 'Витебский государственный университет имени П.М. Машерова', city: 'Витебск', website: 'https://www.vsu.by' },
  { id: 'vgmu', shortName: 'ВГМУ', fullName: 'Витебский государственный ордена Дружбы Народов медицинский университет', city: 'Витебск', website: 'https://www.vgmu.by' },
  { id: 'vgtu', shortName: 'ВГТУ', fullName: 'Витебский государственный технологический университет', city: 'Витебск', website: 'https://www.vgtu.by' },
  { id: 'bgavm', shortName: 'БГАВМ', fullName: 'Белорусская государственная академия ветеринарной медицины', city: 'Витебск', website: 'https://www.bgavm.by' },
  { id: 'pgu', shortName: 'ПолоцкийГУ', fullName: 'Полоцкий государственный университет имени Евфросинии Полоцкой', city: 'Полоцк', website: 'https://www.pgu.by' },
  { id: 'ggu', shortName: 'ГГУ', fullName: 'Гомельский государственный университет имени Франциска Скорины', city: 'Гомель', website: 'https://www.ggu.gomel.by' },
  { id: 'gstu', shortName: 'ГГТУ', fullName: 'Гомельский государственный технический университет им. П.О. Сухого', city: 'Гомель', website: 'https://www.ggtu.gomel.by' },
  { id: 'ggmu', shortName: 'ГГМУ', fullName: 'Гомельский государственный медицинский университет', city: 'Гомель', website: 'https://www.ggmu.gomel.by' },
  { id: 'bgtu', shortName: 'БГУТ', fullName: 'Белорусский государственный университет транспорта', city: 'Гомель', website: 'https://www.bsut.by' },
  { id: 'btec', shortName: 'БТЭУ', fullName: 'Белорусский торгово-экономический университет потребительской кооперации', city: 'Гомель', website: 'https://www.btec.by' },
  { id: 'mgpu', shortName: 'МГПУ', fullName: 'Мозырский государственный педагогический университет им. И.П. Шамякина', city: 'Мозырь', website: 'https://www.mgpu.by' },
  { id: 'grsu', shortName: 'ГрГУ', fullName: 'Гродненский государственный университет имени Янки Купалы', city: 'Гродно', website: 'https://www.grsu.by' },
  { id: 'grsmu', shortName: 'ГрГМУ', fullName: 'Гродненский государственный медицинский университет', city: 'Гродно', website: 'https://www.grsmu.by' },
  { id: 'gcbpl', shortName: 'ГрКБП', fullName: 'Гродненский колледж бизнеса и права', city: 'Гродно', website: 'https://www.gcbpl.by' },
  { id: 'mgu', shortName: 'МГУ', fullName: 'Могилевский государственный университет им. А. А. Кулешова', city: 'Могилев', website: 'https://www.mogilev.by' },
  { id: 'mvd_inst', shortName: 'МИ МВД', fullName: 'Могилевский институт Министерства внутренних дел', city: 'Могилев', website: 'https://www.mvd.by' },
  { id: 'bgsaa', shortName: 'БГСХА', fullName: 'Белорусская государственная сельскохозяйственная академия', city: 'Горки', website: 'https://www.bgsaa.by' },
  { id: 'bgau', shortName: 'БГАУ', fullName: 'Белорусский государственный аграрный университет', city: 'Горки', website: 'https://www.bga.by' },
  { id: 'sec', shortName: 'СЭК', fullName: 'Солигорский экономический колледж', city: 'Солигорск', website: 'https://www.sec.by' },
  { id: 'as', shortName: 'Академия связи', fullName: 'Академия связи Республики Беларусь', city: 'Минск', website: 'https://www.as.by' },
  { id: 'mink', shortName: 'МИНК', fullName: 'Минский институт управления', city: 'Минск', website: 'https://www.mink.by' },
  { id: 'bgup', shortName: 'БГУП', fullName: 'Белорусский государственный университет промышленных технологий', city: 'Минск', website: 'https://www.bsu.by' },
];

async function seed() {
  console.log('Seeding universities...');

  const existing = await db.select({ shortName: universities.shortName }).from(universities);
  const existingSet = new Set(existing.map(r => r.shortName));
  const toInsert = universityData.filter(u => !existingSet.has(u.shortName));

  if (toInsert.length === 0) {
    console.log(`All ${existing.length} universities already in DB. Nothing to insert.`);
    return;
  }

  for (const uni of toInsert) {
    await db.insert(universities).values({
      id: uni.id,
      shortName: uni.shortName,
      fullName: uni.fullName,
      name: uni.fullName,
      city: uni.city,
      website: uni.website,
    });
  }

  const result = await db.select({ count: universities.id }).from(universities);
  console.log(`Inserted ${toInsert.length} new. Total universities in DB: ${result.length}`);
}

seed().catch(console.error);
