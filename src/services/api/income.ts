import { apiClient } from "./base";

export interface IncomeRecord {
  id: string;
  amount: string;
  category: {
    id: string;
    name: string;
    type: "income" | "expense";
  };
  description: string;
  date: string;
}

/**
 * Henter alle brugerens income records fra backend
 * @returns Et array af IncomeRecord objekter
 */
export async function getMyIncome(): Promise<IncomeRecord[]> {
  try {
    // Hent indtægtsoplysninger fra backend
    return await apiClient.request<IncomeRecord[]>("/income/me", {
      method: "GET",
      credentials: "include",
    });
  } catch (error) {
    console.error("Error fetching income records:", error);
    throw error; // Kaster fejlen videre så den kan håndteres i UI laget
  }
}
