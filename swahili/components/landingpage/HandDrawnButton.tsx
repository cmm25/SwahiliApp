'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface HandDrawnButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'default' | 'lg';
  children: React.ReactNode;
}

export const HandDrawnButton = ({ 
  variant = 'primary', 
  size = 'default',
  children, 
  className,
  ...props 
}: HandDrawnButtonProps) => {
  const baseStyles = "relative font-hand transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group overflow-hidden";
  
  const sizes = {
    default: "text-xl md:text-2xl px-6 py-3",
    lg: "text-2xl md:text-3xl px-8 py-4"
  };
  
  const variants = {
    primary: "bg-foreground text-background hover:shadow-lg",
    secondary: "bg-background text-foreground border-2 border-foreground hover:bg-secondary/50",
    ghost: "text-foreground hover:bg-secondary/30"
  };

  return (
    <button
      className={cn(baseStyles, sizes[size], variants[variant], className)}
      style={{
        borderRadius: '4px 12px 6px 14px',
      }}
      {...props}
    >
      {/* Animated underline effect */}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full" style={{ borderRadius: '2px' }} />
      
      {/* Hand-drawn border overlay */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
        fill="none"
      >
        <path 
          d="M2 4 Q 0 0, 98 3 Q 100 1, 97 97 Q 99 100, 3 97 Q 0 99, 2 4" 
          stroke="currentColor" 
          strokeWidth="0.6" 
          fill="none"
          vectorEffect="non-scaling-stroke"
          className={variant === 'primary' ? 'text-background' : 'text-foreground'}
        />
      </svg>
      
      <span className="relative z-10">{children}</span>
    </button>
  );
};
