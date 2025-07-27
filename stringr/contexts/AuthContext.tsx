import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, User } from '@/lib/pocketbase';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoginLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  useEffect(() => {
    // Wait a bit for AsyncStorage to load
    const timer = setTimeout(() => {
      const currentUser = auth.getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoginLoading(true);
    try {
      const authData = await auth.login(email, password);
      setUser(authData.record as unknown as User);
    } finally {
      setIsLoginLoading(false);
    }
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user && auth.isAuthenticated(),
    isLoading,
    isLoginLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
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