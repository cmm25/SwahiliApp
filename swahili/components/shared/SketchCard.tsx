'use client';

import { cn } from "@/lib/utils";
import { ReactNode, CSSProperties } from "react";

interface SketchCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "accent" | "muted" | "success" | "warning";
  hover?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

export function SketchCard({ 
  children, 
  className, 
  variant = "default",
  hover = false,
  onClick,
  style
}: SketchCardProps) {
  const baseStyles = "sketch-border p-5 transition-all duration-200 bg-card/50";
  
  const variants = {
    default: "sketch-shadow",
    accent: "bg-accent/5 sketch-border-accent sketch-shadow-accent",
    muted: "bg-muted/30 border-border/20",
    success: "bg-success/5 border-success/30",
    warning: "bg-warning/5 border-warning/30",
  };
  
  const hoverStyles = hover 
    ? "cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_hsl(var(--foreground)/0.1)]" 
    : "";

  return (
    <div 
      className={cn(baseStyles, variants[variant], hoverStyles, className)}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}
