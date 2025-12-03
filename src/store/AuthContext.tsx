import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthUser {
  nome: string;
  email: string;
  perfil: "admin" | "mentor" | "empreendedor";
}

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  isLoggedIn: boolean;
  login: (user?: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

const STORAGE_KEY = "auth-user-v1";

// Usuário admin padrão para o protótipo
const DEFAULT_ADMIN_USER: AuthUser = {
  nome: "Administrador",
  email: "admin@gurudenegocios.com.br",
  perfil: "admin",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  }, [user]);

  const login = (customUser?: AuthUser) => {
    setUser(customUser || DEFAULT_ADMIN_USER);
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = user?.perfil === "admin";
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

