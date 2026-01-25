'use client';

import type { ReactElement } from "react";
import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
  size?: number;
}

// Hand-drawn style lion mascot
export function LionMascot({ className, size = 80 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={cn("text-foreground", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Mane */}
      <path d="M50 15 C30 10, 15 30, 15 50 C15 70, 30 90, 50 90 C70 90, 85 70, 85 50 C85 30, 70 10, 50 15" className="fill-warning/30" />
      <circle cx="50" cy="52" r="25" className="fill-warning/50" />
      
      {/* Face */}
      <ellipse cx="50" cy="55" rx="18" ry="16" className="fill-card" />
      
      {/* Eyes */}
      <circle cx="43" cy="50" r="3" className="fill-foreground" />
      <circle cx="57" cy="50" r="3" className="fill-foreground" />
      <circle cx="44" cy="49" r="1" className="fill-card" />
      <circle cx="58" cy="49" r="1" className="fill-card" />
      
      {/* Nose */}
      <ellipse cx="50" cy="58" rx="4" ry="3" className="fill-foreground" />
      
      {/* Whiskers */}
      <path d="M35 58 Q40 56, 44 58" />
      <path d="M35 62 Q40 60, 44 60" />
      <path d="M65 58 Q60 56, 56 58" />
      <path d="M65 62 Q60 60, 56 60" />
      
      {/* Mouth */}
      <path d="M47 64 Q50 68, 53 64" />
      
      {/* Ears */}
      <ellipse cx="28" cy="35" rx="6" ry="5" className="fill-warning/50" />
      <ellipse cx="72" cy="35" rx="6" ry="5" className="fill-warning/50" />
    </svg>
  );
}

// Hand-drawn book icon
export function SketchBook({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("text-foreground", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8" className="opacity-50" />
      <path d="M8 11h6" className="opacity-50" />
    </svg>
  );
}

// Hand-drawn speech bubble
export function SketchSpeech({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("text-foreground", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

// Hand-drawn star
export function SketchStar({ className, size = 24, filled = false }: IconProps & { filled?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("text-warning", className)}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// Hand-drawn fire/flame
export function SketchFlame({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("text-destructive", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path 
        d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
        className="fill-destructive/30"
      />
    </svg>
  );
}

// Hand-drawn trophy
export function SketchTrophy({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("text-warning", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" className="fill-warning/30" />
    </svg>
  );
}

// Hand-drawn mountain/journey path
export function JourneyPath({ className }: { className?: string }) {
  return (
    <svg
      className={cn("w-full h-8 text-border", className)}
      viewBox="0 0 400 30"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="8 4"
    >
      <path d="M0 15 Q50 5, 100 15 T200 15 T300 15 T400 15" />
    </svg>
  );
}

// Decorative scribble line
export function ScribbleLine({ className }: { className?: string }) {
  return (
    <svg
      className={cn("w-full h-2", className)}
      viewBox="0 0 200 8"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M0 4 Q25 1, 50 4 T100 4 T150 4 T200 4" />
    </svg>
  );
}

// Hand-drawn checkmark
export function SketchCheck({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("text-success", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

// Hand-drawn lock
export function SketchLock({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("text-muted-foreground", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" className="fill-muted/50" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// Decorative corner flourish
export function CornerFlourish({ className, position = "top-left" }: { className?: string; position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const rotations = {
    "top-left": "",
    "top-right": "scale(-1, 1)",
    "bottom-left": "scale(1, -1)",
    "bottom-right": "scale(-1, -1)",
  };
  
  return (
    <svg
      className={cn("w-12 h-12 text-accent/30", className)}
      viewBox="0 0 50 50"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      style={{ transform: rotations[position] }}
    >
      <path d="M5 45 Q5 25, 25 15 Q35 10, 45 5" />
      <path d="M5 35 Q10 25, 20 20" className="opacity-50" />
    </svg>
  );
}

// Illustrated lesson category icons
export function CategoryIcon({ category, size = 40, className }: { category: string; size?: number; className?: string }) {
  const icons: Record<string, ReactElement> = {
    greetings: (
      <g>
        <circle cx="20" cy="20" r="15" className="fill-accent/20 stroke-accent" strokeWidth="2" />
        <path d="M12 18 Q16 14, 20 18 Q24 14, 28 18" className="stroke-foreground" strokeWidth="2" fill="none" />
        <path d="M15 24 Q20 28, 25 24" className="stroke-foreground" strokeWidth="2" fill="none" />
      </g>
    ),
    numbers: (
      <g>
        <rect x="5" y="5" width="30" height="30" rx="2" className="fill-success/20 stroke-success" strokeWidth="2" />
        <text x="20" y="28" textAnchor="middle" className="fill-foreground font-hand" fontSize="18">123</text>
      </g>
    ),
    colors: (
      <g>
        <circle cx="15" cy="15" r="8" className="fill-destructive/40 stroke-destructive" strokeWidth="2" />
        <circle cx="25" cy="15" r="8" className="fill-warning/40 stroke-warning" strokeWidth="2" />
        <circle cx="20" cy="23" r="8" className="fill-success/40 stroke-success" strokeWidth="2" />
      </g>
    ),
    family: (
      <g>
        <circle cx="15" cy="12" r="6" className="fill-secondary stroke-foreground" strokeWidth="2" />
        <circle cx="28" cy="12" r="5" className="fill-secondary stroke-foreground" strokeWidth="2" />
        <circle cx="21" cy="26" r="4" className="fill-secondary stroke-foreground" strokeWidth="2" />
        <path d="M8 32 Q15 25, 15 20" className="stroke-foreground" strokeWidth="2" fill="none" />
        <path d="M35 32 Q28 25, 28 20" className="stroke-foreground" strokeWidth="2" fill="none" />
      </g>
    ),
    food: (
      <g>
        <ellipse cx="20" cy="24" rx="14" ry="8" className="fill-warning/30 stroke-warning" strokeWidth="2" />
        <path d="M10 20 Q15 12, 20 14 Q25 12, 30 20" className="fill-success/40 stroke-success" strokeWidth="2" />
      </g>
    ),
    travel: (
      <g>
        <path d="M20 5 L20 35 M10 10 L20 5 L30 10 M10 15 L20 10 L30 15" className="stroke-accent" strokeWidth="2" fill="none" />
        <rect x="5" y="28" width="30" height="8" className="fill-secondary stroke-foreground" strokeWidth="2" />
      </g>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={cn("", className)}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[category] || icons.greetings}
    </svg>
  );
}

// Animated sparkles
export function Sparkles({ className }: { className?: string }) {
  return (
    <svg
      className={cn("w-6 h-6 text-warning animate-pulse-glow", className)}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );
}
