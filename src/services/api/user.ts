import { apiClient } from "./base";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  phone?: number;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  profilePictureUrl?: string; // URL til profilbillede
  birthDate?: string; // ISO 8601 format (f.eks. "1990-01-01")
}

/**
 * Henter brugerens profildata fra backend
 * @returns UserProfile objekt med brugerens information
 */
export async function getUserProfile(): Promise<UserProfile> {
  try {
    return await apiClient.request<UserProfile>("/users/profile", {
      method: "GET",
      credentials: "include", // For at inkludere cookies i anmodningen
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}
