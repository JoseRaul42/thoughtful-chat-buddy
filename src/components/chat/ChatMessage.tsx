
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatMessage({ content, isUser, timestamp }: ChatMessageProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "flex w-full mb-4 transition-opacity duration-300 ease-in-out",
        isUser ? "justify-end" : "justify-start",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2 whitespace-pre-wrap",
          isUser
            ? "bg-thoughtful-600 text-white rounded-tr-none"
            : "bg-gray-100 text-gray-900 rounded-tl-none"
        )}
      >
        <div className="text-sm">{content}</div>
        <div
          className={cn(
            "text-xs mt-1 opacity-70",
            isUser ? "text-gray-200" : "text-gray-500"
          )}
        >
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
