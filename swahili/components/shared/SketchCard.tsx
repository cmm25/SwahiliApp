'use client';

import { cn } from "@/lib/utils";
import { ReactNode, CSSProperties } from "react";
import { HandDrawnBorder } from "@/components/shared/Doodle";

interface SketchCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "accent" | "muted" | "success" | "warning";
  hover?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
  doodle?: boolean; // Add hand-drawn border
}

export function SketchCard({ 
  children, 
  className, 
  variant = "default",
  hover = false,
  onClick,
  style,
  doodle = false
}: SketchCardProps) {
  const baseStyles = "relative p-5 transition-all duration-200 bg-card/50";
  
  const variants = {
    default: doodle ? "" : "sketch-border sketch-shadow",
    accent: doodle ? "bg-accent/5" : "bg-accent/5 sketch-border-accent sketch-shadow-accent",
    muted: "bg-muted/30 border-border/20",
    success: "bg-success/5 border-success/30",
    warning: "bg-warning/5 border-warning/30",
  };
  
  const hoverStyles = hover 
    ? "cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_hsl(var(--foreground)/0.1)]" 
    : "";

  const borderVariant = variant === "accent" ? "accent" : 
                        variant === "success" ? "success" : 
                        variant === "warning" ? "warning" : "default";

  return (
    <div 
      className={cn(baseStyles, variants[variant], hoverStyles, !doodle && "sketch-border sketch-shadow", className)}
      onClick={onClick}
      style={style}
    >
      {doodle && <HandDrawnBorder variant={borderVariant} strokeWidth={1.5} />}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
