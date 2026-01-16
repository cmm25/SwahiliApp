'use client';

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SketchCard } from "@/components/shared/SketchCard";
import { SketchButton } from "@/components/shared/SketchButton";
import { PageHeader } from "@/components/shared/PageHeader";
import { Send, Bot, User } from "lucide-react";

export default function Conversation() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Habari! Jina langu ni Rafiki. Ninaweza kukusaidia kujifunza Kiswahili. (Hello! My name is Rafiki. I can help you learn Swahili.)" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "assistant", content: "Nzuri sana! (Very good!) Keep practicing!" }]);
    }, 1000);
  };

  return (
    <AppLayout>
      <PageHeader title="Sema na AI" subtitle="Practice speaking with your AI partner" />
      
      <SketchCard className="h-[65vh] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 p-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""} animate-fade-in-up`}>
              <div className={`w-8 h-8 border border-border/30 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-accent/10" : "bg-secondary/30"}`}>
                {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={`max-w-[70%] p-3 border border-border/20 rounded-sm ${msg.role === "user" ? "bg-accent/5" : "bg-card/50"}`}>
                <p className="font-hand-secondary text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t border-border/30 p-4 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Andika ujumbe... (Type a message...)"
            className="flex-1 px-4 py-2 border border-border/30 rounded-full bg-background font-hand-secondary text-sm focus:outline-none focus:ring-1 focus:ring-accent/30"
          />
          <SketchButton variant="accent" onClick={handleSend} className="rounded-full">
            <Send size={16} />
          </SketchButton>
        </div>
      </SketchCard>
    </AppLayout>
  );
}
