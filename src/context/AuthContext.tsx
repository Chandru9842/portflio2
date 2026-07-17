import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  admin: AdminUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (usernameOrEmail: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Attempt to silently refresh/restore the administrative session on app mount
  const refreshSession = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await res.json();

      if (res.ok && result.success && result.data) {
        setAccessToken(result.data.accessToken);
        setAdmin(result.data.admin);
        return true;
      }
    } catch (err) {
      console.warn('Silently failed to restore admin session:', err);
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const login = async (usernameOrEmail: string, password: string, rememberMe: boolean): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernameOrEmail, password, rememberMe }),
      });

      const result = await res.json();

      if (res.ok && result.success && result.data) {
        setAccessToken(result.data.accessToken);
        setAdmin(result.data.admin);
        setIsLoading(false);
        return true;
      } else {
        setError(result.message || 'Invalid username/email or password.');
        setIsLoading(false);
        return false;
      }
    } catch (err: any) {
      setError('Connection failure. Could not contact administrative server.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (err) {
      console.warn('Admin logout API request failed:', err);
    } finally {
      setAccessToken(null);
      setAdmin(null);
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        admin,
        accessToken,
        isAuthenticated: !!accessToken,
        isLoading,
        error,
        login,
        logout,
        refreshSession,
        clearError,
      }}
    >
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
