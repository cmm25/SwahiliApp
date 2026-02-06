'use client';

import { useState } from "react";
import { SketchButton } from "@/components/shared/SketchButton";
import { PageHeader } from "@/components/shared/PageHeader";
import { Trash2 } from "lucide-react";
import { useConversation } from "@/hooks/useConversation";

import { SketchBorder, CheckeredBackground } from "./_components/BackgroundElements";
import { MessageList } from "./_components/MessageList";
import { ChatInput } from "./_components/ChatInput";

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
            <MessageList 
              messages={messages} 
              isLoading={isLoading} 
              error={error} 
            />
            
            <ChatInput 
              input={input} 
              onInputChange={setInput} 
              onSend={handleSend} 
              isLoading={isLoading} 
            />
          </div>
      </div>
    </>
  );
}
