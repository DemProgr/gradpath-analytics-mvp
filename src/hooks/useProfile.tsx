import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { api } from '@/lib/api/client';

interface University {
  id: string;
  shortName: string;
  fullName: string;
  name?: string;
  city?: string;
  website?: string;
}

interface Faculty {
  id: string;
  name: string;
  code?: string;
}

interface Specialty {
  id: string;
  name: string;
  code?: string;
  degreeType?: string;
  durationYears?: number;
  facultyId?: string;
}

interface Completeness {
  percentage: number;
  missingFields: string[];
  isComplete: boolean;
}

interface VerificationDoc {
  id: number;
  status: string;
  fileName?: string;
  rejectionReason?: string;
  createdAt: string;
}

interface VerificationStatus {
  status: string;
  isVerified: boolean;
  method: string;
  email: string | null;
  document: VerificationDoc | null;
}

export interface Profile {
  id: number;
  userId: string;
  displayName?: string;
  email?: string;
  university?: University | null;
  faculty?: Faculty | null;
  specialty?: Specialty | null;
  course?: number | null;
  enrollmentYear?: number | null;
  expectedGraduationYear?: number | null;
  isUniversityVerified: boolean;
  verificationMethod: string;
  verificationStatus?: string;
  completeness?: Completeness;
  createdAt?: string;
  updatedAt?: string;
}

interface UniversityProfileData {
  universityId: string;
  facultyId?: string | null;
  specialtyId?: string | null;
  course: number;
  enrollmentYear: number;
  expectedGraduationYear: number;
}

interface ProfileContextType {
  profile: Profile | null;
  isLoading: boolean;
  updateUniversity: (data: UniversityProfileData) => Promise<{ error: Error | null }>;
  sendVerificationCode: (email: string) => Promise<{ error: Error | null; data?: any }>;
  confirmVerificationCode: (code: string) => Promise<{ error: Error | null }>;
  uploadDocument: (fileUrl: string, fileName?: string) => Promise<{ error: Error | null; data?: any }>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setProfile(null);
        return;
      }

      const data = await api.get<Profile>('/api/profile');
      setProfile(data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchProfile().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [fetchProfile]);

  const updateUniversity = async (data: UniversityProfileData) => {
    try {
      const updated = await api.put<Profile>('/api/profile/university', data);
      setProfile(updated);
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const sendVerificationCode = async (email: string) => {
    try {
      const data = await api.post<{ message: string; verificationStatus: string }>('/api/profile/verify/send-code', { email });
      await fetchProfile();
      return { error: null, data };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const confirmVerificationCode = async (code: string) => {
    try {
      await api.post('/api/profile/verify/confirm-code', { code });
      await fetchProfile();
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const uploadDocument = async (fileUrl: string, fileName?: string) => {
    try {
      const data = await api.post('/api/profile/verify/document', { fileUrl, fileName });
      await fetchProfile();
      return { error: null, data };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  return (
    <ProfileContext.Provider value={{
      profile, isLoading,
      updateUniversity,
      sendVerificationCode,
      confirmVerificationCode,
      uploadDocument,
      refreshProfile,
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
