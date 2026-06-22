import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { api } from '@/lib/api/client';

export interface Skill {
  id: number;
  userId: number;
  name: string;
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  order: number;
}

export interface Language {
  id: number;
  userId: number;
  name: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  order: number;
}

export interface Project {
  id: number;
  userId: number;
  title: string;
  description?: string | null;
  role?: string | null;
  url?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  order: number;
}

export interface Certificate {
  id: number;
  userId: number;
  name: string;
  issuer: string;
  url?: string | null;
  issueDate?: string | null;
  expiryDate?: string | null;
  order: number;
}

interface DigitalProfileContextType {
  skills: Skill[];
  languages: Language[];
  projects: Project[];
  certificates: Certificate[];
  isLoading: boolean;
  fetchAll: () => Promise<void>;
  // Skills
  addSkill: (data: Partial<Skill>) => Promise<{ error: Error | null }>;
  updateSkill: (id: number, data: Partial<Skill>) => Promise<{ error: Error | null }>;
  deleteSkill: (id: number) => Promise<{ error: Error | null }>;
  reorderSkills: (ids: number[]) => Promise<{ error: Error | null }>;
  // Languages
  addLanguage: (data: Partial<Language>) => Promise<{ error: Error | null }>;
  updateLanguage: (id: number, data: Partial<Language>) => Promise<{ error: Error | null }>;
  deleteLanguage: (id: number) => Promise<{ error: Error | null }>;
  reorderLanguages: (ids: number[]) => Promise<{ error: Error | null }>;
  // Projects
  addProject: (data: Partial<Project>) => Promise<{ error: Error | null }>;
  updateProject: (id: number, data: Partial<Project>) => Promise<{ error: Error | null }>;
  deleteProject: (id: number) => Promise<{ error: Error | null }>;
  reorderProjects: (ids: number[]) => Promise<{ error: Error | null }>;
  // Certificates
  addCertificate: (data: Partial<Certificate>) => Promise<{ error: Error | null }>;
  updateCertificate: (id: number, data: Partial<Certificate>) => Promise<{ error: Error | null }>;
  deleteCertificate: (id: number) => Promise<{ error: Error | null }>;
  reorderCertificates: (ids: number[]) => Promise<{ error: Error | null }>;
}

const DigitalProfileContext = createContext<DigitalProfileContextType | undefined>(undefined);

export function DigitalProfileProvider({ children }: { children: ReactNode }) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const [s, l, p, c] = await Promise.all([
        api.get<Skill[]>('/api/skills'),
        api.get<Language[]>('/api/languages'),
        api.get<Project[]>('/api/projects'),
        api.get<Certificate[]>('/api/certificates'),
      ]);
      setSkills(s || []);
      setLanguages(l || []);
      setProjects(p || []);
      setCertificates(c || []);
    } catch {
      // Not logged in or error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addSkill = async (data: Partial<Skill>) => {
    try {
      const item = await api.post<Skill>('/api/skills', data);
      setSkills(prev => [...prev, item]);
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const updateSkill = async (id: number, data: Partial<Skill>) => {
    try {
      const item = await api.put<Skill>(`/api/skills/${id}`, data);
      setSkills(prev => prev.map(s => s.id === id ? item : s));
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const deleteSkill = async (id: number) => {
    try {
      await api.delete(`/api/skills/${id}`);
      setSkills(prev => prev.filter(s => s.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const reorderSkills = async (ids: number[]) => {
    try {
      await api.put('/api/skills/reorder', { ids });
      setSkills(prev => {
        const map = new Map(prev.map(s => [s.id, s]));
        return ids.map((id, i) => ({ ...map.get(id)!, order: i }));
      });
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const addLanguage = async (data: Partial<Language>) => {
    try {
      const item = await api.post<Language>('/api/languages', data);
      setLanguages(prev => [...prev, item]);
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const updateLanguage = async (id: number, data: Partial<Language>) => {
    try {
      const item = await api.put<Language>(`/api/languages/${id}`, data);
      setLanguages(prev => prev.map(l => l.id === id ? item : l));
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const deleteLanguage = async (id: number) => {
    try {
      await api.delete(`/api/languages/${id}`);
      setLanguages(prev => prev.filter(l => l.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const reorderLanguages = async (ids: number[]) => {
    try {
      await api.put('/api/languages/reorder', { ids });
      setLanguages(prev => {
        const map = new Map(prev.map(l => [l.id, l]));
        return ids.map((id, i) => ({ ...map.get(id)!, order: i }));
      });
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const addProject = async (data: Partial<Project>) => {
    try {
      const item = await api.post<Project>('/api/projects', data);
      setProjects(prev => [...prev, item]);
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const updateProject = async (id: number, data: Partial<Project>) => {
    try {
      const item = await api.put<Project>(`/api/projects/${id}`, data);
      setProjects(prev => prev.map(p => p.id === id ? item : p));
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const deleteProject = async (id: number) => {
    try {
      await api.delete(`/api/projects/${id}`);
      setProjects(prev => prev.filter(p => p.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const reorderProjects = async (ids: number[]) => {
    try {
      await api.put('/api/projects/reorder', { ids });
      setProjects(prev => {
        const map = new Map(prev.map(p => [p.id, p]));
        return ids.map((id, i) => ({ ...map.get(id)!, order: i }));
      });
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const addCertificate = async (data: Partial<Certificate>) => {
    try {
      const item = await api.post<Certificate>('/api/certificates', data);
      setCertificates(prev => [...prev, item]);
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const updateCertificate = async (id: number, data: Partial<Certificate>) => {
    try {
      const item = await api.put<Certificate>(`/api/certificates/${id}`, data);
      setCertificates(prev => prev.map(c => c.id === id ? item : c));
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const deleteCertificate = async (id: number) => {
    try {
      await api.delete(`/api/certificates/${id}`);
      setCertificates(prev => prev.filter(c => c.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const reorderCertificates = async (ids: number[]) => {
    try {
      await api.put('/api/certificates/reorder', { ids });
      setCertificates(prev => {
        const map = new Map(prev.map(c => [c.id, c]));
        return ids.map((id, i) => ({ ...map.get(id)!, order: i }));
      });
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  return (
    <DigitalProfileContext.Provider value={{
      skills, languages, projects, certificates, isLoading, fetchAll,
      addSkill, updateSkill, deleteSkill, reorderSkills,
      addLanguage, updateLanguage, deleteLanguage, reorderLanguages,
      addProject, updateProject, deleteProject, reorderProjects,
      addCertificate, updateCertificate, deleteCertificate, reorderCertificates,
    }}>
      {children}
    </DigitalProfileContext.Provider>
  );
}

export function useDigitalProfile() {
  const context = useContext(DigitalProfileContext);
  if (context === undefined) {
    throw new Error('useDigitalProfile must be used within a DigitalProfileProvider');
  }
  return context;
}
