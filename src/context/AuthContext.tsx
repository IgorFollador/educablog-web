'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  isLoggedIn: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (status === 'unauthenticated' || (session?.expires && new Date(session.expires) <= new Date())) {
      setIsLoggedIn(false);
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      setIsLoggedIn(true);
    }

    setLoading(false);
  }, [status, session, router]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
