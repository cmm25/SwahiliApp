'use client';

import React from 'react';

// Paper Texture - adds a subtle noise/texture overlay
export const PaperTexture = () => {
  return (
    <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[1]">
      <svg width="100%" height="100%">
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.8" 
            numOctaves="3" 
            stitchTiles="stitch" 
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
};

// Grid Lines - adds a subtle grid background
export const GridLines = ({ className = "" }: { className?: string }) => {
  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-[0] opacity-[0.02] ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(to right, currentColor 1px, transparent 1px),
          linear-gradient(to bottom, currentColor 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }}
    />
  );
};

// Highlight Marker - adds a hand-drawn marker effect behind text
export const HighlightMarker = ({ 
  children, 
  color = "accent", 
  className = "" 
}: { 
  children: React.ReactNode; 
  color?: "accent" | "warning" | "success" | "destructive";
  className?: string;
}) => {
  const colorMap = {
    accent: "bg-accent/20",
    warning: "bg-warning/20",
    success: "bg-success/20",
    destructive: "bg-destructive/20"
  };

  return (
    <span className={`relative inline-block ${className}`}>
      <span 
        className={`absolute inset-0 transform -skew-x-12 scale-105 rounded-sm ${colorMap[color]}`}
        style={{
          clipPath: "polygon(0% 10%, 100% 0%, 98% 90%, 2% 100%)"
        }}
      />
      <span className="relative z-10">{children}</span>
    </span>
  );
};

// Floating Shapes - soft decorative background elements
export const FloatingShapes = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <div className="absolute top-6 right-10 w-8 h-8 rounded-full border border-foreground/20 animate-float" />
      <div className="absolute bottom-10 left-8 w-10 h-10 rotate-12 border border-foreground/15 animate-float [animation-delay:0.6s]" />
      <div className="absolute top-1/2 right-16 w-3 h-3 rounded-full bg-foreground/10 animate-float [animation-delay:1.2s]" />
      <div className="absolute bottom-8 right-10 w-5 h-5 border border-foreground/10 rotate-45 animate-float [animation-delay:1.8s]" />
      <div className="absolute top-10 left-12 w-4 h-4 rounded-full bg-foreground/10 animate-float [animation-delay:0.9s]" />
    </div>
  );
};
