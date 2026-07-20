"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, setAccessToken, tryRefresh } from "./api";

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
};

type AuthState = {
  user: AdminUser | null;
  loading: boolean; // true during the initial silent-refresh bootstrap
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  can: (permission: string) => boolean;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // On load, try to restore the session from the refresh cookie.
  useEffect(() => {
    (async () => {
      const ok = await tryRefresh();
      if (ok) {
        try {
          const { user } = await api<{ user: AdminUser }>("/auth/me");
          setUser(user);
        } catch {
          /* token invalid — stay logged out */
        }
      }
      setLoading(false);
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api<{ user: AdminUser; accessToken: string }>("/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    });
    setAccessToken(res.accessToken);
    setUser(res.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api("/auth/logout", { method: "POST" });
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const can = useCallback(
    (permission: string) => !!user?.permissions.includes(permission),
    [user],
  );

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, can }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
