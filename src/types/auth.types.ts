/**
 * Interface til login anmodning
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Interface til login response
 */
export interface LoginResponse {
  access_token: string;
}

/**
 * Interface til auth context
 */
export interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}
