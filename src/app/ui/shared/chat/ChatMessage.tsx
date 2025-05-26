"use client";

interface ChatMessageProps {
  role: "user" | "assistant" | "system";
  content: string;
  isTyping?: boolean;
}

export default function ChatMessage({
  role,
  content,
  isTyping,
}: ChatMessageProps) {
  const bgColor =
    role === "user"
      ? "bg-sky-500 text-white"
      : role === "assistant"
      ? "bg-gray-600 text-gray-200"
      : "bg-yellow-500 text-gray-900";
  const alignment = role === "user" ? "self-end" : "self-start";

  if (isTyping && role === "assistant") {
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
      <p className="text-sm whitespace-pre-wrap">{content}</p>
    </div>
  );
}
