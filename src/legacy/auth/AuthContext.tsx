import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getSessionAction, logoutAction } from '@/app/(frontend)/actions';

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AppUser | null;
  signIn: (user: AppUser) => void;
  signOut: () => Promise<void>;
};

export type AppUser = {
  id: string;
  email: string;
  username: string;
  avatar: string;
  role?: 'user' | 'institution';
  institutionName?: string;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSessionAction()
      .then(session => setUser(session))
      .finally(() => setIsLoading(false));
  }, []);

  const signIn = (session: AppUser) => {
    setUser(session);
    setIsLoading(false);
  };

  const signOut = async () => {
    await logoutAction();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: Boolean(user), isLoading, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
