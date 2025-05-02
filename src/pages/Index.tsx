
import { ChatWindow } from "@/components/chat/ChatWindow";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-white p-4 md:p-8">
      <header className="mb-8 mx-auto max-w-3xl text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Thoughtful AI Support</h1>
        <p className="text-slate-600 max-w-2xl">
          Ask questions about our AI agents and solutions for healthcare automation.
        </p>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto flex flex-col">
        <div className="flex-1 min-h-[500px]">
          <ChatWindow />
        </div>
      </main>

      <footer className="mt-8 text-center text-sm text-slate-500">
        <p>© 2025 Thoughtful AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
