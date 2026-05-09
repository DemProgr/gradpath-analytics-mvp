import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSpecialties(universityId?: number) {
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSpecialties() {
      try {
        let query = supabase
          .from('specialties')
          .select('*')
          .order('name');

        if (universityId) {
          query = query.eq('university_id', universityId);
        }

        const { data, error } = await query;

        if (error) throw error;
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
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSpecialties() {
      try {
        let query = supabase
          .from('specialties')
          .select('*, universities!inner(short_name, city)');

        if (universityShortName) {
          query = query.eq('universities.short_name', universityShortName);
        }

        const { data, error } = await query;

        if (error) throw error;
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