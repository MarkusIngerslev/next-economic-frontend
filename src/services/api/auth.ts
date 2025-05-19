import { apiClient, setCookie, deleteCookie } from "./base";
import { LoginRequest, LoginResponse } from "@/types";

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
   */
  register: async (
    email: string,
    password: string,
    name: string
  ): Promise<string> => {
    return apiClient.request<string>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  },

  /**
   * Udfører logout ved at fjerne JWT token fra cookie
   */
  logout: () => {
    // Slet token fra cookie
    deleteCookie("jwt-token");
    window.location.href = "/login"; // Redirect to login page
  },
};
