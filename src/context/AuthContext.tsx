"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getCookie } from "@/services/api/base";
import { authService } from "@/services/api/auth";
import { AuthContextType } from "@/types";
import { useRouter } from "next/navigation";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Læs token fra cookie ved initial load
    const cookieToken = getCookie("jwt-token");
    if (cookieToken) {
      setToken(cookieToken);
    }
    setIsAuthReady(true); // Marker at auth state er klar
  }, []);

  const login = (newToken: string) => {
    setToken(newToken);
    router.push("/dashboard");
  };

  const logout = () => {
    setToken(null); // Ryd den interne state
    authService.logout(); // Denne kalder deleteCookie("jwt-token") og omdirigerer
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
