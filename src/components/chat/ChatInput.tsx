
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, FormEvent } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex-1">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your question..."
          disabled={isLoading}
          className="w-full"
        />
      </div>
      <Button 
        type="submit" 
        disabled={!message.trim() || isLoading} 
        size="icon" 
        className="bg-sky-600 hover:bg-sky-700" // Changed from thoughtful-600/700 to sky-600/700
      >
        <Send className="h-4 w-4" />
        <span className="sr-only">Send</span>
      </Button>
    </form>
  );
}
