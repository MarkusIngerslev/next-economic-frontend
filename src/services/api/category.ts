import { apiClient } from "./base";

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense"; // Antager at kategorier har en type
  // Tilføj eventuelle andre felter din backend returnerer for en kategori
  // f.eks. description?: string;
  // f.eks. icon?: string;
}

/**
 * Henter alle tilgængelige kategorier fra backend.
 * @returns Et array af Category objekter.
 */
export async function getAllCategories(): Promise<Category[]> {
  try {
    // Hent kategorier fra backend
    const categories = await apiClient.request<Category[]>("/category", {
      method: "GET",
      credentials: "include",
    });
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}
