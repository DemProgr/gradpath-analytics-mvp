import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';

interface Specialty {
  id: string | number;
  name: string;
  code?: string;
  facultyId?: string | number;
  universityId?: string | number;
}

export function useSpecialties(universityId?: number) {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSpecialties() {
      try {
        const params = new URLSearchParams();
        if (universityId) params.set('university_id', String(universityId));
        const data = await api.get<Specialty[]>(`/api/specialties?${params}`);
        setSpecialties(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch specialties');
      } finally {
        setLoading(false);
      }
    }

    fetchSpecialties();
  }, [universityId]);

  return { specialties, loading, error };
}

export function useSpecialtiesWithUniversity(universityShortName?: string) {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSpecialties() {
      try {
        const params = new URLSearchParams();
        if (universityShortName) params.set('university_short_name', universityShortName);
        const data = await api.get<Specialty[]>(`/api/specialties?${params}`);
        setSpecialties(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch specialties');
      } finally {
        setLoading(false);
      }
    }

    fetchSpecialties();
  }, [universityShortName]);

  return { specialties, loading, error };
}
