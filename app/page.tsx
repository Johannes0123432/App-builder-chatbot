"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { DownloadButton } from "@/components/DownloadButton";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  generatedFiles?: Record<string, string>;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `👋 **Welcome to App Builder Chatbot**

Describe the app you want to build and I'll generate a complete, ready-to-deploy project for you.

**Examples:**
- "Build a simple todo app with React and local storage"
- "Create a landing page for a SaaS product with pricing section"
- "Make a weather dashboard that uses a free API"
- "Build a full-stack notes app with Next.js"

Just type what you want below. After generation you'll get a ZIP you can download and deploy.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMessage.content,
          history: messages
            .filter((m) => m.id !== "welcome")
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Generation failed");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        generatedFiles: data.files,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `❌ **Error:** ${error.message || "Something went wrong. Please try again later."}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      {/* Header */}
      <header className="border-b border-zinc-800 px-4 py-4 flex items-center justify-between sticky top-0 bg-zinc-950/90 backdrop-blur z-10">
        <div>
          <h1 className="text-xl font-bold tracking-tight">App Builder</h1>
          <p className="text-xs text-zinc-400">Describe → Generate → Download ZIP → Deploy</p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id}>
            <ChatMessage role={msg.role} content={msg.content} />
            {msg.generatedFiles && Object.keys(msg.generatedFiles).length > 0 && (
              <div className="mt-3 ml-12">
                <DownloadButton files={msg.generatedFiles} />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-zinc-400 ml-12">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-75" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150" />
            </div>
            <span className="text-sm">Generating your app (this can take 20–60 seconds)...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-zinc-800 p-4 bg-zinc-950">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the app you want to build..."
            rows={2}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-zinc-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-xl font-medium transition self-end"
          >
            {isLoading ? "..." : "Generate"}
          </button>
        </div>
        <p className="text-xs text-zinc-500 mt-2">
          Enter to send • Shift+Enter for new line
        </p>
      </form>
    </div>
  );
}
