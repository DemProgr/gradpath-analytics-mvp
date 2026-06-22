import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';
import { ALL_UNIVERSITIES } from '@/data/universityMarks';

export function useUniversities() {
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchUniversities() {
      try {
        const data = await api.get<any[]>('/api/universities');

        if (isMounted) {
          if (!data || data.length === 0) {
            console.log('Database empty, using static university data');
            setUniversities(ALL_UNIVERSITIES.map(u => ({
              id: u.id,
              name: u.full_name,
              short_name: u.short_name,
              city: u.city,
              website: u.website,
              description: ''
            })));
          } else {
            const minskOrder = ['БГУ', 'БГУИР', 'БНТУ', 'БГЭУ', 'БГМУ', 'БГПУ', 'БГТУ', 'БГУКИ', 'БГУФК', 'БГАА', 'БГУИЯ', 'БГАМ', 'БГАИ', 'БГУТ', 'Академия управления', 'Академия МВД', 'Академия связи', 'ВА', 'УГЗ', 'ИПС', 'УНАНБ', 'МГЭИ', 'ИСЗ', 'МИУП', 'КБП', 'МИУ', 'БРУ', 'Филиал РГСУ', 'МГАК', 'БрГУ', 'БрГТУ', 'ПолесскийГУ', 'ВГУ', 'ВГМУ', 'ВГТУ', 'БГАВМ', 'ПолоцкийГУ', 'ГГУ', 'ГГТУ', 'ГГМУ', 'БТЭУ', 'МГПУ', 'ГрГУ', 'ГрГМУ', 'ГрКБП', 'МГУ', 'МИ МВД', 'БГСХА', 'БГАУ', 'СЭК'];
            const sorted = data.sort((a: any, b: any) => {
              const aMinsk = a.city === 'Минск' ? 0 : 1;
              const bMinsk = b.city === 'Минск' ? 0 : 1;
              if (aMinsk !== bMinsk) return aMinsk - bMinsk;
              const aIdx = minskOrder.indexOf(a.short_name);
              const bIdx = minskOrder.indexOf(b.short_name);
              if (aIdx >= 0 && bIdx >= 0) return aIdx - bIdx;
              if (aIdx >= 0) return -1;
              if (bIdx >= 0) return 1;
              return a.short_name.localeCompare(b.short_name);
            });
            setUniversities(sorted);
          }
        }
      } catch (err) {
        console.log('Using static university data due to error');
        if (isMounted) {
          setUniversities(ALL_UNIVERSITIES.map(u => ({
            id: u.id,
            name: u.full_name,
            short_name: u.short_name,
            city: u.city,
            website: u.website,
            description: ''
          })));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchUniversities();
    return () => { isMounted = false; };
  }, []);

  return { universities, loading, error };
}

export function useUniversity(shortName: string) {
  const [university, setUniversity] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shortName) return;

    async function fetchUniversity() {
      try {
        const data = await api.get<any>('/api/universities?search=' + encodeURIComponent(shortName));
        const found = Array.isArray(data) ? data.find((u: any) => u.short_name === shortName) : data;

        if (found) {
          setUniversity(found);
        } else {
          const staticUni = ALL_UNIVERSITIES.find(u => u.short_name === shortName);
          if (staticUni) {
            setUniversity({
              id: staticUni.id,
              name: staticUni.full_name,
              short_name: staticUni.short_name,
              city: staticUni.city,
              website: staticUni.website,
              description: ''
            });
          } else {
            setError('University not found');
          }
        }
      } catch (err) {
        const staticUni = ALL_UNIVERSITIES.find(u => u.short_name === shortName);
        if (staticUni) {
          setUniversity({
            id: staticUni.id,
            name: staticUni.full_name,
            short_name: staticUni.short_name,
            city: staticUni.city,
            website: staticUni.website,
            description: ''
          });
        } else {
          setError(err instanceof Error ? err.message : 'Failed to fetch university');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUniversity();
  }, [shortName]);

  return { university, loading, error };
}
