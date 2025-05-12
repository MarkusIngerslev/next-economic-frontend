import { apiClient } from "./base";

// Type for income record
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

// Type for PATCH request payload
export interface IncomeUpdatePayload {
  amount?: number; // Forventes som tal af backend ved opdatering
  description?: string;
  date?: string; // Format YYYY-MM-DD
  categoryId?: string;
}

// Type for POST request payload (Oprettelse af indkomst)
export interface IncomeCreatePayload {
  amount: number; // Forventes som tal af backend ved oprettelse
  categoryId: string;
  description: string;
  date: string; // Format YYYY-MM-DD
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

/**
 * Opdaterer en specifik income record i backend.
 * @param id ID på den income record der skal opdateres.
 * @param updatedData Et objekt med de felter der skal opdateres.
 *                  'amount' skal være et tal.
 *                  'date' forventes i 'YYYY-MM-DD' format.
 * @returns Den opdaterede IncomeRecord (hvor amount igen er en string).
 */
export async function updateIncomeRecord(
  id: string,
  updatedData: IncomeUpdatePayload // Brug den nye payload type
): Promise<IncomeRecord> {
  try {
    const payload = { ...updatedData };
    // Ingen speciel håndtering af dato her, da den allerede forventes som YYYY-MM-DD string
    // Amount sendes nu som et tal, hvis det er inkluderet i payload

    return await apiClient.request<IncomeRecord>(`/income/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  } catch (error) {
    console.error(`Error updating income record with id ${id}:`, error);
    throw error;
  }
}

/**
 * Sletter en specifik income record i backend.
 * @param id ID på den income record der skal slettes.
 * @returns En bekræftelse eller ingenting (afhængigt af backend implementation).
 */
export async function deleteIncomeRecord(id: string): Promise<void> {
  try {
    await apiClient.request<void>(`/income/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  } catch (error) {
    console.error(`Error deleting income record with id ${id}:`, error);
    throw error; // Kaster fejlen videre så den kan håndteres i UI laget
  }
}

/**
 * Opretter en ny income record i backend.
 * @param incomeData Data for den nye indkomstpost.
 *                   'amount' skal være et tal.
 *                   'date' forventes i 'YYYY-MM-DD' format.
 * @returns Den oprettede IncomeRecord.
 */
export async function createIncomeRecord(
  incomeData: IncomeCreatePayload
): Promise<IncomeRecord> {
  try {
    return await apiClient.request<IncomeRecord>("/income", {
      method: "POST",
      body: JSON.stringify(incomeData),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  } catch (error) {
    console.error("Error creating income record:", error);
    throw error;
  }
}
