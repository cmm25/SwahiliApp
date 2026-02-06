'use client';

import { Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export function MessageList({ messages, isLoading, error }: MessageListProps) {
  return (
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
  );
}
