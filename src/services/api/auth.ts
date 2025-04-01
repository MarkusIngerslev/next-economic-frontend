import { apiClient } from "./base";

/**
 * Interface til login anmodning
 */
interface LoginRequest {
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
    return apiClient.request<string>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
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
};
