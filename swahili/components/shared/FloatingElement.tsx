'use client';

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface FloatingElementProps {
  children: ReactNode;
  delay?: number;
  reverse?: boolean;
  className?: string;
}

export function FloatingElement({ 
  children, 
  delay = 0, 
  reverse = false,
  className 
}: FloatingElementProps) {
  return (
    <div 
      className={cn(
        reverse ? "animate-float-reverse" : "animate-float",
        className
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
