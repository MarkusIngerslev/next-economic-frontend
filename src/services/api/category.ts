import { apiClient } from "./base";

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
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

/**
 * Henter kategorier af en specifik type fra backend.
 * @param type Typen af kategorier der skal hentes ("income" eller "expense").
 * @returns Et array af Category objekter.
 */
export async function getCategoriesByType(
  type: "income" | "expense"
): Promise<Category[]> {
  try {
    const categories = await apiClient.request<Category[]>(
      `/category?type=${type}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    return categories;
  } catch (error) {
    console.error(`Error fetching ${type} categories:`, error);
    throw error;
  }
}

/**
 * Henter en enkelt kategori fra backend baseret på ID.
 * @param id ID'et på kategorien der skal hentes.
 * @returns Et Category objekt.
 */
export async function getCategoryById(id: string): Promise<Category> {
  try {
    const category = await apiClient.request<Category>(`/category/${id}`, {
      method: "GET",
      credentials: "include",
    });
    return category;
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error);
    throw error;
  }
}

/**
 * Opretter en ny kategori i backend.
 * @param categoryData Data for den nye kategori.
 * @returns Den oprettede Category objekt.
 */
export async function createCategory(
  categoryData: Omit<Category, "id">
): Promise<Category> {
  try {
    const newCategory = await apiClient.request<Category>("/category", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(categoryData),
    });
    return newCategory;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

/**
 * Opdaterer en eksisterende kategori i backend.
 * @param id ID'et på kategorien der skal opdateres.
 * @param categoryData Data der skal opdateres for kategorien.
 * @returns Den opdaterede Category objekt.
 */
export async function updateCategory(
  id: string,
  categoryData: Partial<Omit<Category, "id">>
): Promise<Category> {
  try {
    const updatedCategory = await apiClient.request<Category>(
      `/category/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(categoryData),
      }
    );
    return updatedCategory;
  } catch (error) {
    console.error(`Error updating category with id ${id}:`, error);
    throw error;
  }
}

/**
 * Sletter en kategori fra backend.
 * @param id ID'et på kategorien der skal slettes.
 */
export async function deleteCategory(id: string): Promise<void> {
  try {
    await apiClient.request<void>(`/category/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  } catch (error) {
    console.error(`Error deleting category with id ${id}:`, error);
    throw error;
  }
}
