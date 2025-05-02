
import { cn } from "@/lib/utils";

export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1 px-4 py-3 max-w-[100px] bg-slate-100 rounded-lg mb-4">
      <div className={cn("w-2 h-2 rounded-full bg-slate-400 animate-typing-dot-1")} />
      <div className={cn("w-2 h-2 rounded-full bg-slate-400 animate-typing-dot-2")} />
      <div className={cn("w-2 h-2 rounded-full bg-slate-400 animate-typing-dot-3")} />
    </div>
  );
}
