import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Teacher } from '../types';
import * as authService from '../services/authService';

const TOKEN_KEY = 'mural_token';
const TEACHER_KEY = 'mural_teacher';

interface AuthContextValue {
  teacher: Teacher | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaura a sessão do localStorage ao carregar a página
  useEffect(() => {
    const storedTeacher = localStorage.getItem(TEACHER_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);

    if (storedTeacher && storedToken) {
      setTeacher(JSON.parse(storedTeacher));
    }

    setIsLoading(false);
  }, []);

  async function login(email: string, password: string): Promise<void> {
    const result = await authService.login(email, password);
    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(TEACHER_KEY, JSON.stringify(result.teacher));
    setTeacher(result.teacher);
  }

  function logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TEACHER_KEY);
    setTeacher(null);
  }

  return (
    <AuthContext.Provider
      value={{ teacher, isAuthenticated: !!teacher, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de um AuthProvider');
  }

  return context;
}