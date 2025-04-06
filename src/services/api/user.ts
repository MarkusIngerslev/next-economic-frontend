import { apiClient } from "./base";

export interface UserProfile {
  id: string;
  email: string;
  roles: string[];
  firstName: string;
  lastName: string;
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
