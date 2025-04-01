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

    const defaultHeaders = {
      "Content-Type": "application/json",
    };

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
