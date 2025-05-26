import { apiClient } from "./base";

export interface HistoryMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// Interface for the /ai/completion request body
export interface AiCompletionRequest {
  message: string;
  history?: HistoryMessage[]; // Optional history of messages for context
}

// Expected response type from the AI (assuming it's a string)
export interface AiResponse {
  reply: string; // Or whatever structure your backend returns, e.g., { message: "response" }
}

//Interface for the nested category object within a context item
export interface ContextItemCategoryDetail {
  id: string;
  name: string;
  type: "income" | "expense"; // Set to string if other types are possible in the future
}

// Unified interface for detailed income or expense items to be sent as AI context
export interface DetailedContextItem {
  id: string;
  amount: string;
  category: ContextItemCategoryDetail;
  description: string;
  date: string;
}

// Interface for the contextData object
export interface AiContextData {
  expenses?: DetailedContextItem[];
  income?: DetailedContextItem[];
}

// Interface for the /ai/contextual-completion request body
export interface AiContextualCompletionRequest {
  message: string;
  contextData: AiContextData;
  history?: HistoryMessage[]; // Optional history of messages for context
}

/**
 * Sends a message to the /ai/completion endpoint.
 * @param message The message to send to the AI.
 * @param history Optional array of previous messages in the conversation.
 * @returns The AI's response.
 */
export async function getAiCompletion(
  message: string,
  history?: HistoryMessage[]
): Promise<AiResponse> {
  // const payload: AiCompletionRequest = { message, history }; // Use if you want to include history
  const payload: AiCompletionRequest = { message }; // Omit history if not needed
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
 * @param history Optional array of previous messages in the conversation.
 * @returns The AI's response.
 */
export async function getAiContextualCompletion(
  message: string,
  contextData: AiContextData,
  history?: HistoryMessage[]
): Promise<AiResponse> {
  // const payload: AiContextualCompletionRequest = { message, contextData, history}; // Use if you want to include history
  const payload: AiContextualCompletionRequest = {
    message,
    contextData,
  };
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
