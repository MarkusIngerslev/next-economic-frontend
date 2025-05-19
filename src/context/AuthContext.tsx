"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getCookie, deleteCookie } from "@/services/api/base";
import { authService } from "@/services/api/auth";
import { AuthContextType } from "@/types";
import { useRouter } from "next/navigation";

// Helper funktion til at dekode JWT payload
// Denne funktion verificerer ikke signaturen, men læser kun payload'en.
// Det er tilstrækkeligt til at tjekke 'exp' claim på klient-siden.
function decodeJwtPayload(
  token: string
): { exp?: number; [key: string]: any } | null {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) {
      console.warn("Invalid JWT token: missing payload part.");
      return null;
    }
    const decodedJson = atob(payloadBase64); // atob() dekoder base64-strenge
    return JSON.parse(decodedJson);
  } catch (error) {
    console.error("Failed to decode JWT payload:", error);
    return null;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cookieToken = getCookie("jwt-token");
    if (cookieToken) {
      const payload = decodeJwtPayload(cookieToken);
      // Tjek om token har en 'exp' claim og om den er gyldig
      if (payload && payload.exp && payload.exp * 1000 > Date.now()) {
        setToken(cookieToken);
      } else {
        // Token er udløbet eller ugyldigt, log brugeren ud
        console.log(
          "Initial token check: Token expired or invalid. Logging out."
        );
        authService.logout("session_expired_initial"); // Send besked-kode
      }
    }
    setIsAuthReady(true);
  }, []); // Kør kun ved mount

  const login = (newToken: string) => {
    setToken(newToken);
    router.push("/dashboard");
  };

  const logout = (message?: string) => {
    // Tilføj message som en valgfri parameter her
    setToken(null);
    authService.logout(message); // Brug den modtagne message parameter
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (token) {
      const checkTokenExpiry = () => {
        const payload = decodeJwtPayload(token);
        if (payload && payload.exp) {
          const expirationTime = payload.exp * 1000; // Konverter 'exp' (sekunder) til millisekunder
          if (expirationTime < Date.now()) {
            console.log("Token expired during session, logging out.");
            logout("session_expired_interval"); // Send besked-kode
          }
        } else if (payload === null) {
          // Hvis token ikke kan dekodes (f.eks. er blevet korrupt)
          console.warn("Token became undecodable during session, logging out.");
          logout("session_corrupt"); // Send besked-kode
        }
      };

      // Tjek tokenets gyldighed med det samme og derefter periodisk
      checkTokenExpiry();
      intervalId = setInterval(checkTokenExpiry, 60000); // Tjek hvert 60. sekund
    }

    // Ryd op i intervallet, når komponenten unmountes, eller token ændres
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [token, logout]); // Genkør denne effekt, hvis token ændres

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
