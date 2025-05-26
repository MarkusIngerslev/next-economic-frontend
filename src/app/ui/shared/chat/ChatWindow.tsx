"use client";

import { useState, useRef, useEffect } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ChatMessage from "./ChatMessage";
import {
  getAiCompletion,
  getAiContextualCompletion,
} from "@/services/api/chatAi";
import type {
  AiResponse,
  AiContextData,
  DetailedContextItem,
  HistoryMessage,
} from "@/services/api/chatAi";
import { usePathname } from "next/navigation";
import { getMyExpense, ExpenseRecord } from "@/services/api/expense";
import { getMyIncome, IncomeRecord } from "@/services/api/income";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

export default function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "system",
      content:
        "Hej! Hvordan kan jeg hjælpe dig i dag? Du kan spørge generelt, eller bede mig bruge kontekst fra siden.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usePageContext, setUsePageContext] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const pathname = usePathname();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const mapToDetailedContextItem = (
    item: ExpenseRecord | IncomeRecord
  ): DetailedContextItem => ({
    id: item.id,
    amount: String(item.amount), // Sikrer at amount er en string
    category: {
      id: item.category.id,
      name: item.category.name,
      type: item.category.type,
    },
    description: item.description,
    date: item.date,
  });

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    // Prepare history: Filter out system messages and map to HistoryMessage format
    const conversationHistory: HistoryMessage[] = messages
      .filter((msg) => msg.role === "user" || msg.role === "assistant")
      .map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      let aiReply: AiResponse;
      if (usePageContext) {
        let contextData: AiContextData = {};
        // Tjekker om vi er på udgiftssiden
        if (pathname.includes("/dashboard/spending")) {
          const expenses = await getMyExpense();
          contextData.expenses = expenses.map(mapToDetailedContextItem);
          setMessages((prev) => [
            ...prev,
            {
              id: "context-info-expense",
              role: "system",
              content: `Bruger ${expenses.length} udgiftsposter som kontekst.`,
            },
          ]);
        } else if (pathname.includes("/dashboard/budget")) {
          // Tjekker om vi er på indkomstsiden
          const income = await getMyIncome();
          contextData.income = income.map(mapToDetailedContextItem);
          setMessages((prev) => [
            ...prev,
            {
              id: "context-info-income",
              role: "system",
              content: `Bruger ${income.length} indkomstposter som kontekst.`,
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: "context-info-none",
              role: "system",
              content:
                "Ingen specifik sidekontekst (udgifter/indtægter) fundet. Stiller generelt spørgsmål.",
            },
          ]);
        }
        aiReply = await getAiContextualCompletion(
          userMessage.content, // Send current user message text
          contextData
          // conversationHistory // Udcommentere denne linje hvis historik skal inkluderes
        );
      } else {
        aiReply = await getAiCompletion(
          userMessage.content // Send current user message text
          // conversationHistory // Udcommentere denne linje hvis historik skal inkluderes
        );
      }
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: aiReply.reply,
        },
      ]);
    } catch (error) {
      console.error("Error sending message to AI:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "system",
          content: "Beklager, der opstod en fejl. Prøv igen.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-5 w-80 md:w-96 h-[500px] bg-gray-800 border border-gray-700 rounded-lg shadow-xl flex flex-col z-40">
      <div className="p-3 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Chat med AI</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
          aria-label="Luk chat"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="flex-grow p-3 overflow-y-auto space-y-2 bg-gray-800">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
        ))}
        {isLoading && (
          <ChatMessage role="assistant" content="" isTyping={true} />
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-2 border-t border-gray-700">
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="useContextToggle"
            checked={usePageContext}
            onChange={(e) => setUsePageContext(e.target.checked)}
            className="mr-2 h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-500 rounded bg-gray-700"
          />
          <label htmlFor="useContextToggle" className="text-sm text-gray-300">
            Brug sidekontekst (udgifter/indtægter hvis relevant)
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
            placeholder="Skriv din besked..."
            className="flex-grow p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-sky-500 focus:border-sky-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || input.trim() === ""}
            className="bg-sky-600 hover:bg-sky-700 text-white p-2 rounded-md disabled:opacity-50"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
