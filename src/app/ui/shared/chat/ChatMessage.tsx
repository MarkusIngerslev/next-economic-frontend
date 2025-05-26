"use client";

interface ChatMessageProps {
  sender: "user" | "ai" | "system";
  text: string;
  isTyping?: boolean;
}

export default function ChatMessage({
  sender,
  text,
  isTyping,
}: ChatMessageProps) {
  const bgColor =
    sender === "user"
      ? "bg-sky-500 text-white"
      : sender === "ai"
      ? "bg-gray-600 text-gray-200"
      : "bg-yellow-500 text-gray-900";
  const alignment = sender === "user" ? "self-end" : "self-start";

  if (isTyping && sender === "ai") {
    return (
      <div
        className={`p-2 rounded-lg max-w-xs md:max-w-md mb-2 ${alignment} ${bgColor}`}
      >
        <div className="flex items-center space-x-1">
          <span className="text-sm">AI tænker</span>
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse delay-75"></div>
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse delay-150"></div>
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse delay-225"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-3 rounded-lg max-w-xs md:max-w-md mb-2 shadow ${alignment} ${bgColor}`}
    >
      <p className="text-sm whitespace-pre-wrap">{text}</p>
    </div>
  );
}
