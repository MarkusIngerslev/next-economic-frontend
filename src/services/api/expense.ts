import { apiClient } from "./base";

// Type for expense record
export interface ExpenseRecord {
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
export interface ExpenseUpdatePayload {
  amount?: number; // Forventes som tal af backend ved opdatering
  description?: string;
  date?: string; // Format YYYY-MM-DD
  categoryId?: string;
}

// Type for POST request payload (Oprettelse af indkomst)
export interface ExpenseCreatePayload {
  amount: number; // Forventes som tal af backend ved oprettelse
  categoryId: string;
  description: string;
  date: string; // Format YYYY-MM-DD
}

/**
 * Henter alle brugerens expense records fra backend
 * @returns Et array af ExpenseRecord objekter
 */
export async function getMyExpense(): Promise<ExpenseRecord[]> {
  try {
    // Hent indtægtsoplysninger fra backend
    return await apiClient.request<ExpenseRecord[]>("/expense/me", {
      method: "GET",
      credentials: "include",
    });
  } catch (error) {
    console.error("Error fetching expense records:", error);
    throw error; // Kaster fejlen videre så den kan håndteres i UI laget
  }
}

/**
 * Opdaterer en specifik expense record i backend.
 * @param id ID på den expense record der skal opdateres.
 * @param updatedData Et objekt med de felter der skal opdateres.
 *                  'amount' skal være et tal.
 *                  'date' forventes i 'YYYY-MM-DD' format.
 * @returns Den opdaterede ExpenseRecord (hvor amount igen er en string).
 */
export async function updateExpenseRecord(
  id: string,
  updatedData: ExpenseUpdatePayload // Brug den nye payload type
): Promise<ExpenseRecord> {
  try {
    const payload = { ...updatedData };
    // Ingen speciel håndtering af dato her, da den allerede forventes som YYYY-MM-DD string
    // Amount sendes nu som et tal, hvis det er inkluderet i payload

    return await apiClient.request<ExpenseRecord>(`/expense/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  } catch (error) {
    console.error(`Error updating expense record with id ${id}:`, error);
    throw error;
  }
}

/**
 * Sletter en specifik expense record i backend.
 * @param id ID på den expense record der skal slettes.
 * @returns En bekræftelse eller ingenting (afhængigt af backend implementation).
 */
export async function deleteExpenseRecord(id: string): Promise<void> {
  try {
    await apiClient.request<void>(`/expense/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  } catch (error) {
    console.error(`Error deleting expense record with id ${id}:`, error);
    throw error; // Kaster fejlen videre så den kan håndteres i UI laget
  }
}

/**
 * Opretter en ny expense record i backend.
 * @param expenseData Data for den nye indkomstpost.
 *                   'amount' skal være et tal.
 *                   'date' forventes i 'YYYY-MM-DD' format.
 * @returns Den oprettede ExpenseRecord.
 */
export async function createExpenseRecord(
  expenseData: ExpenseCreatePayload
): Promise<ExpenseRecord> {
  try {
    return await apiClient.request<ExpenseRecord>("/expense", {
      method: "POST",
      body: JSON.stringify(expenseData),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  } catch (error) {
    console.error("Error creating expense record:", error);
    throw error;
  }
}
