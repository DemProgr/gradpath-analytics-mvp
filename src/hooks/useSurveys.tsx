import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { api } from '@/lib/api/client';

export interface Survey {
  id: number;
  userId: number;
  milestone: string;
  isEmployed: boolean | null;
  country: string | null;
  company: string | null;
  position: string | null;
  salary: number | null;
  isInSpecialty: boolean | null;
  employedAt: string | null;
  createdAt: string;
  year?: number | null;
}

export interface SurveyStatus {
  canFill: boolean;
  reason: string;
  graduationYear: number | null;
  monthsSinceGraduation?: number;
  availableMilestones?: string[];
  completedMilestones: string[];
  nextMilestone: string | null;
  trajectory: Survey[];
  isDebugMode?: boolean;
}

interface SurveyContextType {
  status: SurveyStatus | null;
  surveys: Survey[];
  trajectory: Survey[];
  isLoading: boolean;
  submitSurvey: (data: any) => Promise<{ error: Error | null }>;
  refresh: () => Promise<void>;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export function SurveyProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SurveyStatus | null>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [trajectory, setTrajectory] = useState<Survey[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) { setIsLoading(false); return; }
    const debugYear = localStorage.getItem('debug_graduation_year');
    const debugParam = debugYear ? `?debug_graduation_year=${debugYear}` : '';
    try {
      const [s, sv, tr] = await Promise.all([
        api.get<SurveyStatus>(`/api/surveys/status${debugParam}`),
        api.get<Survey[]>('/api/surveys'),
        api.get<Survey[]>('/api/surveys/trajectory'),
      ]);
      setStatus(s);
      setSurveys(sv || []);
      setTrajectory(tr || []);
    } catch (err) {
      console.error('Failed to fetch survey data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const submitSurvey = async (data: any) => {
    try {
      const item = await api.post<Survey>('/api/surveys', data);
      setSurveys(prev => [...prev, item]);
      await refresh();
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  return (
    <SurveyContext.Provider value={{ status, surveys, trajectory, isLoading, submitSurvey, refresh }}>
      {children}
    </SurveyContext.Provider>
  );
}

export function useSurveys() {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurveys must be used within a SurveyProvider');
  }
  return context;
}
