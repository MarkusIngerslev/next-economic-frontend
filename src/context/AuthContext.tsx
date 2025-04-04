"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContextType } from "@/types";

const AuthContext = createContext<AuthContextType>({
  token: null,
  login: () => {},
  logout: () => {},
  isAuthReady: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt-token");
    if (storedToken) {
      setToken(storedToken);
    }
    setIsAuthReady(true);
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("jwt-token", newToken);
    setToken(newToken);
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("jwt-token");
    setToken(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
