"use client";

import { useState } from "react";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import ChatWindow from "@/app/ui/shared/chat/ChatWindow";

export default function ChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-5 right-5 bg-sky-600 hover:bg-sky-700 text-white p-3 rounded-full shadow-lg z-50 transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
        aria-label={isChatOpen ? "Luk chat" : "Åbn chat for hjælp"}
        title={isChatOpen ? "Luk chat" : "Brug for hjælp?"}
      >
        {isChatOpen ? (
          <XMarkIcon className="h-7 w-7" />
        ) : (
          <ChatBubbleOvalLeftEllipsisIcon className="h-7 w-7" />
        )}
      </button>
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
