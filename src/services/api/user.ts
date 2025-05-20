import { apiClient } from "./base";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  phone?: number | string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  profilePictureUrl?: string;
  birthDate?: string;
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

/**
 * Henter alle brugerprofiler fra backend (kun for admin).
 * @returns Et array af UserProfile objekter.
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    // Vigtigt: Du skal oprette et endpoint i din backend, f.eks. `/users/all` eller `/admin/users`.
    // Dette endpoint skal være beskyttet, så kun administratorer kan tilgå det.
    // Backend skal returnere en liste af brugere.
    return await apiClient.request<UserProfile[]>("/users", {
      // Dette endpoint er et eksempel.
      method: "GET",
      credentials: "include", // For at inkludere cookies (JWT token) i anmodningen
    });
  } catch (error) {
    console.error("Error fetching all users:", error);
    // Overvej at kaste en mere specifik fejl baseret på statuskode, hvis muligt
    throw error; // Kaster fejlen videre, så den kan håndteres i UI laget
  }
}

/**
 * Opdaterer brugerens profildata på backend
 * @param updatedData Et objekt indeholdende de felter, der skal opdateres
 * @returns Den opdaterede UserProfile fra backend (selvom backend pt. returnerer noget andet)
 */
export async function updateUserProfile(
  updatedData: Partial<UserProfile>
): Promise<UserProfile> {
  // Beholder UserProfile her for nu
  try {
    // Send updatedData direkte som payload
    return await apiClient.request<UserProfile>("/users/update-profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      // Send updatedData direkte
      body: JSON.stringify(updatedData),
      credentials: "include",
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

/**
 * Opdaterer en specifik brugers roller (kun for admin).
 * @param userId ID på brugeren der skal opdateres.
 * @param roles Et array af strenge med de nye roller, f.eks. ["user"] eller ["admin"].
 * @returns Den opdaterede UserProfile.
 */
export async function updateUserRoles(
  userId: string,
  roles: string[]
): Promise<UserProfile> {
  try {
    return await apiClient.request<UserProfile>(
      `/auth/admin/update-user-roles/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roles }), // Sender { "roles": ["user"] } eller { "roles": ["admin"] }
        credentials: "include",
      }
    );
  } catch (error) {
    console.error(`Error updating roles for user ${userId}:`, error);
    // Overvej at kaste en mere specifik fejl baseret på statuskode
    throw error;
  }
}
