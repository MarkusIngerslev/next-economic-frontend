import { apiClient } from "./base";

// Interface for the /ai/completion request body
export interface AiCompletionRequest {
  message: string;
}

// Expected response type from the AI (assuming it's a string)
export interface AiResponse {
  reply: string; // Or whatever structure your backend returns, e.g., { message: "response" }
}

// Interface for an individual expense item in contextData
export interface ContextExpenseItem {
  category: string;
  amount: number;
  description: string;
}

// Interface for an individual income item in contextData
export interface ContextIncomeItem {
  source: string;
  amount: number;
}

// Interface for the contextData object
export interface AiContextData {
  expenses?: ContextExpenseItem[];
  income?: ContextIncomeItem[];
}

// Interface for the /ai/contextual-completion request body
export interface AiContextualCompletionRequest {
  message: string;
  contextData: AiContextData;
}



/**
 * Sends a message to the /ai/completion endpoint.
 * @param message The message to send to the AI.
 * @returns The AI's response.
 */
export async function getAiCompletion(message: string): Promise<AiResponse> {
  const payload: AiCompletionRequest = { message };
  try {
    const response = await apiClient.request<AiResponse>("/ai/completion", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error getting AI completion:", error);
    throw error;
  }
}

/**
 * Sends a message and context data to the /ai/contextual-completion endpoint.
 * @param message The message to send to the AI.
 * @param contextData The contextual data (income/expenses) for the AI.
 * @returns The AI's response.
 */
export async function getAiContextualCompletion(
  message: string,
  contextData: AiContextData
): Promise<AiResponse> {
  const payload: AiContextualCompletionRequest = { message, contextData };
  try {
    const response = await apiClient.request<AiResponse>(
      "/ai/contextual-completion",
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error getting contextual AI completion:", error);
    throw error;
  }
}
