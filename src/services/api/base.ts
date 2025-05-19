// Helper function to set a cookie (client-side)
export function setCookie(name: string, value: string, days: number) {
  if (typeof window === "undefined") return;
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  // For produktion over HTTPS, tilføj '; Secure' for øget sikkerhed.
  // SameSite=Lax er en god standardindstilling.
  document.cookie =
    name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

// Helper function to get a cookie (client-side)
export function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Helper function to delete a cookie (client-side)
export function deleteCookie(name: string) {
  if (typeof window === "undefined") return;
  // For produktion over HTTPS, tilføj '; Secure'.
  document.cookie = name + "=; Max-Age=-99999999; path=/; SameSite=Lax";
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Basis funktionalitet til API kald
 */
export const apiClient = {
  /**
   * Udfører et API kald med fetch
   */
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    // Hent token fra cookie
    const token = typeof window !== "undefined" ? getCookie("jwt-token") : null;

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Tilføj Authorization header med token hvis den findes
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text().catch(() => "Ukendt fejl");
      throw new Error(
        errorMessage || `${response.status}: ${response.statusText}`
      );
    }

    // Håndter forskellige response typer
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    } else {
      // For tekst responses (som din token)
      const text = await response.text();
      return text as unknown as T;
    }
  },
};
