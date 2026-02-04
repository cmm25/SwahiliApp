'use client';

import { useState } from "react";
import { SketchButton } from "@/components/shared/SketchButton";
import { PageHeader } from "@/components/shared/PageHeader";
import { Send, Bot, User, Trash2 } from "lucide-react";
import { useConversation } from "@/hooks/useConversation";

// Sketch border that stays within bounds
function SketchBorder({ className }: { className?: string }) {
  return (
    <svg 
      className={`absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] pointer-events-none ${className}`}
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <path
        d="M 2,2 
           C 6,1 16,3 26,1.5 
           S 46,3 56,1 
           S 76,2.5 86,1.5 
           S 97,3 98,2
           C 99,6 97,16 99,26 
           S 97,46 99,56 
           S 97,76 99,86 
           S 97,97 98,98
           C 94,99 84,97 74,99 
           S 54,97 44,99 
           S 34,97 14,99 
           S 3,97 2,98
           C 1,94 3,84 1,74 
           S 3,54 1,44 
           S 3,24 1,14 
           S 3,3 2,2 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        className="text-foreground/40"
      />
    </svg>
  );
}

// Checkered grid background component
function CheckeredBackground({ className }: { className?: string }) {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(to right, hsl(var(--foreground) / 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, hsl(var(--foreground) / 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '32px 32px'
      }}
    />
  );
}

export default function Conversation() {
  const { messages, sendMessage, isLoading, error, clearHistory } = useConversation();
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const messageToSend = input;
    setInput(""); // Clear input immediately
    
    await sendMessage(messageToSend);
  };

  return (
    <>
      <PageHeader 
          title="Sema na AI" 
          subtitle="Practice speaking with your AI partner"
          action={
            <SketchButton 
              variant="outline" 
              size="sm" 
              onClick={clearHistory}
              title="Start New Chat"
            >
              <Trash2 size={16} />
            </SketchButton>
          }
        />
        
        {/* Sketch-style chat container */}
      <div className="relative h-[60vh] sm:h-[65vh] bg-card/20 overflow-hidden rounded-lg">
          {/* Sketch border - properly contained */}
          <SketchBorder />
          
          {/* Subtle grid background */}
          <CheckeredBackground />
          
          {/* Chat messages area */}
          <div className="relative z-10 h-full flex flex-col p-2">
            <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 p-3 sm:p-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 sm:gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""} animate-fade-in`}>
                  {/* Avatar with sketch style */}
                  <div className={`relative w-9 h-9 sm:w-10 sm:h-10 sketch-border flex items-center justify-center flex-shrink-0 ${
                    msg.role === "user" ? "bg-accent/10" : "bg-card"
                  }`}>
                    {msg.role === "user" ? <User size={16} className="text-foreground/70" /> : <Bot size={16} className="text-foreground/70" />}
                  </div>
                  
                  {/* Message bubble with sketch border */}
                  <div className={`relative max-w-[80%] sm:max-w-[75%] p-3 sm:p-4 sketch-border ${
                    msg.role === "user" 
                      ? "bg-accent/5" 
                      : "bg-card"
                  }`}>
                    <p className="font-hand-secondary text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 sm:gap-3 animate-fade-in">
                  <div className="relative w-9 h-9 sm:w-10 sm:h-10 sketch-border flex items-center justify-center flex-shrink-0 bg-card">
                    <Bot size={16} className="text-foreground/70" />
                  </div>
                  <div className="relative max-w-[80%] sm:max-w-[75%] p-3 sm:p-4 sketch-border bg-card">
                    <p className="font-hand-secondary text-sm text-muted-foreground animate-pulse">Rafiki is typing...</p>
                  </div>
                </div>
              )}
              {error && (
                <div className="text-center p-2">
                  <span className="text-destructive text-sm font-hand-secondary bg-destructive/10 px-3 py-1 rounded-full">{error}</span>
                </div>
              )}
            </div>
            
            {/* Input area with sketch style */}
            <div className="border-t border-dashed border-border/40 p-3 sm:p-4 bg-background/60">
              <div className="flex gap-2 sm:gap-3 items-center">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
                  placeholder={isLoading ? "Please wait..." : "Andika ujumbe... (Type a message...)"}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 sm:py-3 sketch-border bg-card font-hand-secondary text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 rounded-sm disabled:opacity-50"
                />
                <SketchButton 
                  variant="accent" 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center p-0 flex-shrink-0 disabled:opacity-50"
                >
                  <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
                </SketchButton>
              </div>
            </div>
          </div>
      </div>
    </>
  );
}
