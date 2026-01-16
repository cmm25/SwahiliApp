'use client';

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface SketchButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "accent" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const SketchButton = forwardRef<HTMLButtonElement, SketchButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const baseStyles = "font-hand-secondary font-medium transition-all duration-200 inline-flex items-center justify-center gap-2 rounded-full";
    
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
      accent: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm",
      outline: "bg-transparent text-foreground border border-foreground/20 hover:bg-secondary/50",
      ghost: "bg-transparent text-foreground hover:bg-secondary/30",
    };
    
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

SketchButton.displayName = "SketchButton";
