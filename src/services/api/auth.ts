import { apiClient, setCookie, deleteCookie } from "./base";
import { LoginRequest, LoginResponse } from "@/types";

// Tilføj en interface for registreringsanmodningen
interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/**
 * Auth service til håndtering af authentication-relaterede API kald
 */
export const authService = {
  /**
   * Udfører login
   * @returns JWT token som string
   */
  login: async (email: string, password: string): Promise<string> => {
    const data: LoginRequest = { email, password };
    const response = await apiClient.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.access_token) {
      // Gem token i en cookie i stedet for localStorage
      setCookie("jwt-token", response.access_token, 7); // Gemmer i 7 dage
    }
    return response.access_token;
  },

  /**
   * Registrerer en ny bruger
   * @returns JWT token som string
   */
  register: async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<string> => {
    const data: RegisterRequest = { firstName, lastName, email, password };
    // Antager at backend returnerer token direkte som en streng
    const token = await apiClient.request<string>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (token) {
      setCookie("jwt-token", token, 7); // Gemmer i 7 dage, ligesom login
    }
    return token;
  },

  /**
   * Udfører logout ved at fjerne JWT token fra cookie
   * @param message Valgfri besked-kode der skal vises på login-siden (f.eks. "session_expired")
   */
  logout: (message?: string) => {
    deleteCookie("jwt-token");
    let redirectUrl = "/login";
    if (message) {
      redirectUrl += `?message=${encodeURIComponent(message)}`;
    }
    window.location.href = redirectUrl; // Redirect to login page
  },
};
