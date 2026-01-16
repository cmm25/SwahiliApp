'use client';

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface XPBadgeProps {
  xp: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function XPBadge({ xp, size = "md", showLabel = true, className }: XPBadgeProps) {
  const sizes = {
    sm: { icon: 14, text: "text-sm", padding: "px-2 py-1" },
    md: { icon: 18, text: "text-base", padding: "px-3 py-1.5" },
    lg: { icon: 24, text: "text-xl", padding: "px-4 py-2" },
  };

  const formatXP = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toString();
  };

  return (
    <div 
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-hand-secondary bg-warning/20 text-warning-foreground",
        sizes[size].padding,
        className
      )}
    >
      <Star 
        size={sizes[size].icon} 
        className="text-warning"
        fill="currentColor"
      />
      <span className={cn("font-bold", sizes[size].text)}>{formatXP(xp)}</span>
      {showLabel && (
        <span className={cn(sizes[size].text, "opacity-80")}>XP</span>
      )}
    </div>
  );
}
