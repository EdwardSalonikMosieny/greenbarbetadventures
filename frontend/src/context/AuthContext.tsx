import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { get, post } from '../lib/apiClient';

interface Admin {
  id: string;
  email: string;
  name: string;
}

interface LoginResponse {
  token: string;
  admin: Admin;
}

interface MeResponse {
  admin: Admin;
}

interface AuthContextValue {
  admin: Admin | null;
  token: string | null;
  /** True while restoring a session from a stored token on first load. */
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const TOKEN_STORAGE_KEY = 'gba_admin_token';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY),
  );
  // Only actually "loading" if there's a stored token to verify — no token means the
  // isLoading branch below never runs, so the initial value can reflect that up front
  // instead of the effect synchronously flipping it on first render.
  const [isLoading, setIsLoading] = useState(() => !!localStorage.getItem(TOKEN_STORAGE_KEY));

  // On first load, a stored token only proves someone logged in previously — verify it's
  // still valid (and fetch the current admin) against the server rather than trusting it blindly.
  useEffect(() => {
    if (!token) {
      return;
    }
    get<MeResponse>('/auth/me', token)
      .then((res) => setAdmin(res.admin))
      .catch(() => {
        setToken(null);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      })
      .finally(() => setIsLoading(false));
    // Only ever runs once per stored token on mount — login()/logout() manage state directly afterward.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await post<LoginResponse>('/auth/login', { email, password });
    setToken(res.token);
    setAdmin(res.admin);
    localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ admin, token, isLoading, login, logout }),
    [admin, token, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

export { AuthProvider, useAuth };
