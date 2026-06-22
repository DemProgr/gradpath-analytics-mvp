import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { api } from '@/lib/api/client';

interface User {
  id: number;
  email: string;
  displayName?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (password: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      api.setToken(token);
      api.get<{ user: User }>('/api/auth/me')
        .then(({ user }) => {
          setUser(user);
          setIsAdmin(user.role === 'admin');
        })
        .catch(() => {
          api.setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { token, user } = await api.post<{ token: string; user: User }>('/api/auth/login', { email, password });
      api.setToken(token);
      setUser(user);
      setIsAdmin(user.role === 'admin');
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { token, user } = await api.post<{ token: string; user: User }>('/api/auth/register', { email, password });
      api.setToken(token);
      setUser(user);
      setIsAdmin(user.role === 'admin');
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    api.setToken(null);
    setUser(null);
    setIsAdmin(false);
  };

  const resetPassword = async (_email: string) => {
    return { error: null };
  };

  const updatePassword = async (_password: string) => {
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, signIn, signUp, signOut, resetPassword, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
