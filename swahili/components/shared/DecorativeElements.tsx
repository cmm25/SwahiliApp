'use client';

import { cn } from "@/lib/utils";

// Paper texture overlay
export function PaperTexture({ className }: { className?: string }) {
  return (
    <div 
      className={cn(
        "absolute inset-0 pointer-events-none opacity-[0.03]",
        className
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

// Decorative dots pattern
export function DotsPattern({ className }: { className?: string }) {
  return (
    <div 
      className={cn(
        "absolute inset-0 pointer-events-none opacity-10",
        className
      )}
      style={{
        backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
      }}
    />
  );
}

// Hand-drawn divider
export function SketchDivider({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-4 my-6", className)}>
      <svg
        className="w-full h-full text-border"
        viewBox="0 0 400 16"
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M0 8 Q50 4, 100 8 T200 8 T300 8 T400 8" />
      </svg>
    </div>
  );
}

// Animated floating shapes
export function FloatingShapes({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {/* Circle */}
      <div className="absolute top-20 left-[10%] w-8 h-8 sketch-border bg-accent/10 rounded-full animate-float" style={{ animationDelay: '0s' }} />
      
      {/* Square */}
      <div className="absolute top-40 right-[15%] w-6 h-6 sketch-border bg-secondary/50 rotate-12 animate-float-reverse" style={{ animationDelay: '0.5s' }} />
      
      {/* Rectangle */}
      <div className="absolute bottom-32 left-[20%] w-10 h-4 sketch-border bg-muted/50 -rotate-6 animate-float" style={{ animationDelay: '1s' }} />
      
      {/* Small circle */}
      <div className="absolute bottom-20 right-[25%] w-4 h-4 sketch-border bg-warning/20 rounded-full animate-float-reverse" style={{ animationDelay: '1.5s' }} />
      
      {/* Triangle-ish */}
      <div 
        className="absolute top-60 left-[5%] w-0 h-0 animate-float" 
        style={{ 
          borderLeft: '12px solid transparent',
          borderRight: '12px solid transparent',
          borderBottom: '20px solid hsl(var(--accent) / 0.2)',
          animationDelay: '2s'
        }} 
      />
    </div>
  );
}

// Grid lines background
export function GridLines({ className }: { className?: string }) {
  return (
    <div 
      className={cn(
        "absolute inset-0 pointer-events-none opacity-[0.05]",
        className
      )}
      style={{
        backgroundImage: `
          linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
          linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }}
    />
  );
}

// Highlight marker effect
export function HighlightMarker({ children, color = "accent", className }: { 
  children: React.ReactNode; 
  color?: "accent" | "warning" | "success";
  className?: string;
}) {
  const colors = {
    accent: "bg-accent/20",
    warning: "bg-warning/20", 
    success: "bg-success/20",
  };
  
  return (
    <span className={cn("relative inline-block", className)}>
      <span 
        className={cn(
          "absolute inset-0 -skew-y-1 transform",
          colors[color]
        )} 
        style={{ 
          borderRadius: '2px 8px 5px 10px',
          margin: '-2px -4px',
          padding: '2px 4px',
        }}
      />
      <span className="relative">{children}</span>
    </span>
  );
}

// Sticky note style card
export function StickyNote({ children, color = "warning", className, rotate = 0 }: {
  children: React.ReactNode;
  color?: "warning" | "accent" | "success" | "secondary";
  className?: string;
  rotate?: number;
}) {
  const colors = {
    warning: "bg-warning/20 border-warning/50",
    accent: "bg-accent/20 border-accent/50",
    success: "bg-success/20 border-success/50",
    secondary: "bg-secondary border-border",
  };
  
  return (
    <div 
      className={cn(
        "p-4 border-2 shadow-md relative",
        colors[color],
        className
      )}
      style={{ 
        transform: `rotate(${rotate}deg)`,
        borderRadius: '2px 4px 6px 3px',
      }}
    >
      {/* Tape effect */}
      <div 
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-secondary/80 border border-border"
        style={{ borderRadius: '1px' }}
      />
      {children}
    </div>
  );
}

// Progress dots indicator
export function ProgressDots({ total, current, className }: {
  total: number;
  current: number;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-2", className)}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-3 h-3 sketch-border transition-all",
            i < current 
              ? "bg-accent" 
              : i === current 
                ? "bg-accent/50 animate-pulse" 
                : "bg-muted"
          )}
          style={{ borderRadius: i % 2 === 0 ? '2px 4px 3px 5px' : '4px 2px 5px 3px' }}
        />
      ))}
    </div>
  );
}

// Wavy underline text
export function WavyText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("sketch-underline inline-block", className)}>
      {children}
    </span>
  );
}
