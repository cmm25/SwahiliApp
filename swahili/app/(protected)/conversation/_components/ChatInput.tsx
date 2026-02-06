'use client';

import { Send } from "lucide-react";
import { SketchButton } from "@/components/shared/SketchButton";

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

export function ChatInput({ input, onInputChange, onSend, isLoading }: ChatInputProps) {
  return (
    <div className="border-t border-dashed border-border/40 p-3 sm:p-4 bg-background/60">
      <div className="flex gap-2 sm:gap-3 items-center">
        <input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !isLoading && onSend()}
          placeholder={isLoading ? "Please wait..." : "Andika ujumbe... (Type a message...)"}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 sm:py-3 sketch-border bg-card font-hand-secondary text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 rounded-sm disabled:opacity-50"
        />
        <SketchButton 
          variant="accent" 
          onClick={onSend}
          disabled={isLoading || !input.trim()}
          className="rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center p-0 flex-shrink-0 disabled:opacity-50"
        >
          <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
        </SketchButton>
      </div>
    </div>
  );
}
