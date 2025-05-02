
import { ChatInput } from "./ChatInput";
import { ChatMessage, ChatMessageProps } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { ChatHeader } from "./ChatHeader";
import { useEffect, useRef, useState } from "react";
import { generateResponse, LLMConfig, defaultLLMConfig } from "@/services/llm";
import { findFaqMatch } from "@/services/faqMatcher";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessageProps[]>(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        return JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [llmConfig, setLLMConfig] = useState<LLMConfig>(() => {
    const savedConfig = localStorage.getItem('llmConfig');
    return savedConfig ? JSON.parse(savedConfig) : defaultLLMConfig;
  });

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // Save LLM config to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('llmConfig', JSON.stringify(llmConfig));
  }, [llmConfig]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add initial welcome message if chat is empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          content: "👋 Hi there! I'm your Thoughtful AI assistant. How can I help you today?",
          isUser: false,
          timestamp: new Date()
        }
      ]);
    }
  }, [messages.length]);

  const handleSendMessage = async (content: string) => {
    // Reset error state
    setError(null);
    
    // Add user message
    const userMessage: ChatMessageProps = {
      content,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // First try to match with FAQ
      const faqMatch = findFaqMatch(content);
      
      if (faqMatch) {
        // Small delay to simulate processing
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setMessages(prev => [
          ...prev,
          {
            content: faqMatch.text,
            isUser: false,
            timestamp: new Date()
          }
        ]);
      } else {
        // If no FAQ match, try LLM
        const llmResponse = await generateResponse(content, llmConfig);
        
        if (llmResponse) {
          setMessages(prev => [
            ...prev,
            {
              content: llmResponse.text,
              isUser: false,
              timestamp: new Date()
            }
          ]);
        }
      }
    } catch (error: any) {
      console.error("Error processing message:", error);
      setError(error.message || "Failed to process your message. Please check your connection and settings.");
      setMessages(prev => [
        ...prev,
        {
          content: "Sorry, I encountered an error while processing your request. Please check the error message above for details.",
          isUser: false,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        content: "👋 Hi there! I'm your Thoughtful AI assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date()
      }
    ]);
    setError(null);
  };

  return (
    <div className="flex flex-col h-full max-h-full rounded-lg border shadow-sm bg-white overflow-hidden">
      <ChatHeader 
        llmConfig={llmConfig} 
        onConfigChange={setLLMConfig} 
        clearChat={clearChat}
      />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <Alert variant="destructive" className="mb-4 animate-pulse">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {messages.map((message, index) => (
          <ChatMessage key={index} {...message} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
