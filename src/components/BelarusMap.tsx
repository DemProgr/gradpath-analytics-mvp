import { useState, useEffect } from 'react';
import { imagePath } from '@/lib/imagePath';

interface Region {
  id: string;
  name: string;
  universities?: UniversityItem[];
}

interface UniversityItem {
  name: string;
  shortName: string;
}

function Popup({ clicked, clickPos, regions }: { clicked: string, clickPos: { x: number, y: number }, regions: Region[] }) {
  const region = regions.find(r => r.id === clicked) as Region | undefined;
  if (!region) return null;
  
  const unis = region.universities || [];
  
  return (
    <div 
      className="absolute bg-white px-4 py-3 rounded-lg shadow-lg z-10 animate-fade-in"
      style={{ 
        left: `${(clickPos.x / 709.60931) * 100}%`, 
        bottom: `${(1 - clickPos.y / 612.51825) * 100 + 10}%`, 
        transform: 'translateX(-50%)',
        maxWidth: '300px',
        width: 'max-content'
      }}
    >
      <div className="absolute left-1/2 -bottom-2 -ml-2 w-4 h-4 bg-white rotate-45 shadow-lg"></div>
      <h3 className="font-semibold text-gray-900">{region.name}</h3>
      {unis.length > 0 ? (
        <div className="mt-2 overflow-y-auto" style={{ maxHeight: '250px' }}>
          {unis.map((uni, i) => (
            <div key={uni.shortName}>
              <a href={`/university/${encodeURIComponent(uni.shortName)}`} className="flex items-center justify-between text-xs text-gray-700 hover:text-amber-600 py-1 block" style={{ lineHeight: '1.6' }}>
                <span>{uni.name}</span>
                <span>→</span>
              </a>
              {i < unis.length - 1 && <hr className="border-gray-200 my-0.5" />}
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-gray-200">
            <a href="/universities" className="text-xs text-amber-600 hover:text-amber-700 font-medium">
              Все университеты →
            </a>
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-500 mt-1">12 университетов</p>
      )}
    </div>
  );
}

const MINSK_UNIVERSITIES: UniversityItem[] = [
  { name: 'Белорусский государственный университет', shortName: 'БГУ' },
  { name: 'Белорусский государственный университет информатики и радиоэлектроники', shortName: 'БГУИР' },
  { name: 'Белорусский национальный технический университет', shortName: 'БНТУ' },
  { name: 'Белорусский государственный медицинский университет', shortName: 'БГМУ' },
  { name: 'Белорусский государственный экономический университет', shortName: 'БГЭУ' },
  { name: 'Белорусский государственный педагогический университет', shortName: 'БГПУ' },
  { name: 'Белорусский государственный университет иностранных языков', shortName: 'БГУИЯ' },
  { name: 'Белорусский государственный университет культуры и искусств', shortName: 'БГУКИ' },
  { name: 'Белорусский государственный университет физической культуры', shortName: 'БГУФК' },
  { name: 'Белорусский государственный технологический университет', shortName: 'БГТУ' },
  { name: 'Белорусская государственная академия авиации', shortName: 'БГАА' },
  { name: 'Академия управления при Президенте РБ', shortName: 'Академия управления' },
  { name: 'Академия МВД РБ', shortName: 'Академия МВД' },
  { name: 'Белорусская государственная академия искусств', shortName: 'БГАИ' },
  { name: 'Белорусская государственная академия музыки', shortName: 'БГАМ' },
  { name: 'Белорусская государственная академия связи', shortName: 'БГАС' },
  { name: 'Военная академия РБ', shortName: 'ВА' },
  { name: 'Университет гражданской защиты МЧС', shortName: 'УГЗ' },
  { name: 'Институт пограничной службы РБ', shortName: 'ИПС' },
  { name: 'Университет НАН Беларуси', shortName: 'УНАНБ' },
  { name: 'Международный государственный экологический институт', shortName: 'МГЭИ' },
  { name: 'Институт современных знаний', shortName: 'ИСЗ' },
  { name: 'Международный институт управления и предпринимательства', shortName: 'МИУП' },
  { name: 'Колледж бизнеса и права', shortName: 'КБП' },
  { name: 'Минский инновационный университет', shortName: 'МИУ' },
  { name: 'Белорусско-Российский университет', shortName: 'БРУ' },
  { name: 'Филиал РГСУ', shortName: 'Филиал РГСУ' },
  { name: 'Минский государственный автомеханический колледж', shortName: 'МГАК' },
];

const BREST_UNIVERSITIES: UniversityItem[] = [
  { name: 'Брестский государственный университет', shortName: 'БрГУ' },
  { name: 'Брестский государственный технический университет', shortName: 'БрГТУ' },
  { name: 'Полесский государственный университет', shortName: 'ПолесскийГУ' },
];

const GOMEL_UNIVERSITIES: UniversityItem[] = [
  { name: 'Гомельский государственный университет', shortName: 'ГГУ' },
  { name: 'Гомельский государственный технический университет', shortName: 'ГГТУ' },
  { name: 'Гомельский государственный медицинский университет', shortName: 'ГГМУ' },
  { name: 'Белорусский государственный университет транспорта', shortName: 'БГУТ' },
  { name: 'Белорусский торгово-экономический университет', shortName: 'БТЭУ' },
  { name: 'Мозырский государственный педагогический университет', shortName: 'МГПУ' },
];

const GRODNO_UNIVERSITIES: UniversityItem[] = [
  { name: 'Гродненский государственный университет', shortName: 'ГрГУ' },
  { name: 'Гродненский государственный медицинский университет', shortName: 'ГрГМУ' },
  { name: 'Гродненский колледж бизнеса и права', shortName: 'ГрКБП' },
];

const VITEBSK_UNIVERSITIES: UniversityItem[] = [
  { name: 'Витебский государственный университет', shortName: 'ВГУ' },
  { name: 'Витебский государственный медицинский университет', shortName: 'ВГМУ' },
  { name: 'Витебский государственный технологический университет', shortName: 'ВГТУ' },
  { name: 'Белорусская государственная академия ветеринарной медицины', shortName: 'БГАВМ' },
  { name: 'Полоцкий государственный университет', shortName: 'ПолоцкийГУ' },
];

const MOGILEV_UNIVERSITIES: UniversityItem[] = [
  { name: 'Могилевский государственный университет', shortName: 'МГУ' },
  { name: 'Могилевский институт МВД', shortName: 'МИ МВД' },
  { name: 'Белорусская государственная сельскохозяйственная академия', shortName: 'БГСХА' },
  { name: 'Белорусский государственный аграрный университет', shortName: 'БГАУ' },
];

const regions: Region[] = [
  { id: 'BY-BR', name: 'Брестская обл.', universities: BREST_UNIVERSITIES },
  { id: 'BY-HO', name: 'Гомельская обл.', universities: GOMEL_UNIVERSITIES },
  { id: 'BY-HR', name: 'Гродненская обл.', universities: GRODNO_UNIVERSITIES },
  { id: 'BY-MA', name: 'Могилёвская обл.', universities: MOGILEV_UNIVERSITIES },
  { id: 'BY-VI', name: 'Витебская обл.', universities: VITEBSK_UNIVERSITIES },
  { id: 'BY-MI', name: 'Минск', universities: MINSK_UNIVERSITIES },
];

interface PathData {
  id: string;
  d: string;
  cx: number;
  cy: number;
}

const regionCenters: Record<string, { cx: number; cy: number }> = {
  'BY-BR': { cx: 150, cy: 450 },
  'BY-HO': { cx: 500, cy: 450 },
  'BY-HR': { cx: 140, cy: 330 },
  'BY-MA': { cx: 520, cy: 280 },
  'BY-VI': { cx: 420, cy: 100 },
  'BY-HM': { cx: 330, cy: 320 },
  'BY-MI': { cx: 325, cy: 295 },
};

export function BelarusMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [clicked, setClicked] = useState<string | null>(null);
  const [clickPos, setClickPos] = useState<{ x: number; y: number } | null>(null);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(imagePath('/belarus-map.svg'))
      .then(res => res.text())
      .then(svgText => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');
        const pathElements = doc.querySelectorAll('path');
        const pathData: PathData[] = [];
        pathElements.forEach(path => {
          const id = path.getAttribute('id');
          const d = path.getAttribute('d');
          if (d && d.startsWith('m ') && id) {
            const center = regionCenters[id];
            if (center) {
              pathData.push({ id, d, cx: center.cx, cy: center.cy });
            }
          }
        });
        setPaths(pathData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load SVG:', err);
        setLoading(false);
      });
  }, []);

  const getFill = (id: string): string => {
    if (clicked === id) return '#e8e4d3';
    if (hovered === id) return '#e4ebf2';
    return '#e6e4dc';
  };

  if (loading) {
    return <div className="w-full h-64 flex items-center justify-center">Загрузка карты...</div>;
  }

  return (
    <div className="relative w-full">
<svg
        viewBox="0 0 709.60931 612.51825"
        className="w-full h-auto"
        style={{ maxHeight: '500px' }}
        onClick={() => { setClicked(null); setClickPos(null); }}
      >
{paths.map((path) => (
            <g key={path.id}>
              <path
                id={path.id}
                d={path.d}
                fill={getFill(path.id)}
                stroke="#ffffff"
                strokeWidth="0.5"
                style={{ cursor: 'pointer', transition: 'fill 0.2s ease', pointerEvents: 'all' }}
                onMouseEnter={() => setHovered(path.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setClicked(path.id); 
                  setClickPos({ x: path.cx, y: path.cy });
                }}
              />
              <circle
                cx={path.cx}
                cy={path.cy}
                r="6"
                fill="#dc2626"
                stroke="#ffffff"
                strokeWidth="1"
                style={{ pointerEvents: 'none' }}
              />
            </g>
          ))}
      </svg>

      {clicked && clickPos && (
        <Popup clicked={clicked} clickPos={clickPos} regions={regions} />
      )}

      {!clicked && hovered && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 px-3 py-1.5 rounded">
          <span className="text-white text-sm">{regions.find(r => r.id === hovered)?.name}</span>
        </div>
      )}
    </div>
  );
}