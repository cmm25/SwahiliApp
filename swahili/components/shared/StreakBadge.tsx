'use client';

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  streak: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function StreakBadge({ streak, size = "md", showLabel = true, className }: StreakBadgeProps) {
  const sizes = {
    sm: { icon: 16, text: "text-sm", padding: "px-2 py-1" },
    md: { icon: 20, text: "text-base", padding: "px-3 py-1.5" },
    lg: { icon: 28, text: "text-xl", padding: "px-4 py-2" },
  };

  const isActive = streak > 0;

  return (
    <div 
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-hand-secondary",
        sizes[size].padding,
        isActive ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground",
        className
      )}
    >
      <Flame 
        size={sizes[size].icon} 
        className={cn(
          isActive && "animate-fire-flicker text-accent"
        )}
        fill={isActive ? "currentColor" : "none"}
      />
      <span className={cn("font-bold", sizes[size].text)}>{streak}</span>
      {showLabel && (
        <span className={cn(sizes[size].text, "opacity-80")}>
          {streak === 1 ? "day" : "days"}
        </span>
      )}
    </div>
  );
}
